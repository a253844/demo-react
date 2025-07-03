using Microsoft.AspNetCore.Mvc;
using MyApi.Data;
using System.Linq;
using MyApi.Models;
using System.IO;
using System;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using QuestPDF.Drawing;
using QuestPDF.Elements;
using static MyApi.Helpers.Enums;
using System.Collections.Generic;
using EntityFramework.Extensions;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Diagnostics;
using Microsoft.AspNetCore.SignalR;
using MyApi.Helpers;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace MyApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReceiptController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly string _reportPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        private readonly IHubContext<ReportHub> _hub;
        private readonly IConfiguration _configuration;

        public ReceiptController(AppDbContext context, IHubContext<ReportHub> hub, IConfiguration configuration)
        {
            _context = context;
            _hub = hub;
            _configuration = configuration;
        }

        [HttpGet("GetList")]
        public IActionResult GetList([FromQuery] int treatmentId)
        {
            var receipts = _context.Receipts
                    .Where(p => p.TreatmentId == treatmentId &&
                                p.IsDelete == false)
                    .ToList();


            return Ok(receipts);
        }

        [HttpPost("Insert")]
        public IActionResult Insert([FromBody] List<Receipt> data)
        {
            try
            {
                var userId = User.FindFirst("UserId");

                var treatments = _context.Treatments
                .Where(p => p.Id == data.First().TreatmentId && 
                            p.IsDelete == false)
                .ToList();

                if (treatments.Count > 0)
                {
                    if (treatments.First().Step != TreatmentStep.CaseClose &&
                        treatments.First().Step != TreatmentStep.CreateReceipt)
                    {
                        return BadRequest("此病患尚未結束療程");
                    }
                    if (!string.IsNullOrEmpty(treatments.First().ReceiptUrl))
                    {
                        return BadRequest("此案件收據已開立");
                    }
                }
                else
                {
                    return BadRequest("未找到案件資料");
                }

                var receipts = _context.Receipts
                    .Where(p => p.TreatmentId == data.First().TreatmentId &&
                                p.IsDelete == false)
                    .ToList();

                if (receipts.Count > 0)
                {
                    return BadRequest("此案件收據已存在");
                }

                var datetimestr = DateTime.Now.ToString("yyyyMMdd");

                var OrdreNomber = _context.Receipts
                    .Where(p => p.OrdreNo.Contains(datetimestr))
                    .OrderBy(p => p.OrdreNo)
                    .Select(p => p.OrdreNo)
                    .Take(1)
                    .ToList();

                var OrdreNo = "";

                if (OrdreNomber.Count > 0)
                {
                    OrdreNo = (Convert.ToInt64(OrdreNomber.FirstOrDefault()) + 1).ToString();
                }
                else
                {
                    OrdreNo = datetimestr + "1".PadLeft(3, '0');
                }

                var OptionUserId = int.Parse(userId.Value);
                var UpdatedAt = DateTime.Now;


                foreach (var item in data)
                {

                    item.OrdreNo = OrdreNo;
                    item.OptionUserId = OptionUserId;
                    item.UpdatedAt = UpdatedAt;
                       
                    _context.Receipts.Add(item);
                }

                treatments.First().Step = TreatmentStep.CreateReceipt;
                treatments.First().OptionUserId = OptionUserId;
                treatments.First().UpdatedAt = UpdatedAt;

                _context.SaveChanges();

                var result = new
                {
                    Msg = "收據資料已新增",
                    OrdreNo = OrdreNo
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"新增失敗: {ex.Message}");
            }
        }

        [HttpPut("Update")]
        public IActionResult Update([FromBody] List<Receipt> data)
        {
            var userId = User.FindFirst("UserId");

            var treatments = _context.Treatments
                .Where(p => p.Id == data.First().TreatmentId &&
                            p.IsDelete == false)
                .ToList();

            if (treatments.Count > 0)
            {
                if (treatments.First().Step != TreatmentStep.CaseClose &&
                    treatments.First().Step != TreatmentStep.CreateReceipt)
                {
                    return BadRequest("此病患尚未結束療程");
                }
                if (!string.IsNullOrEmpty(treatments.First().ReceiptUrl))
                {
                    return BadRequest("此案件收據已開立");
                }
            }
            else
            {
                return BadRequest("未找到案件資料");
            }

            var toDelete = _context.Receipts
                .Where(p => p.TreatmentId == data.First().TreatmentId &&
                            p.OrdreNo == data.First().OrdreNo)
                .ToList();

            _context.Receipts.RemoveRange(toDelete);


            var OptionUserId = int.Parse(userId.Value);
            var UpdatedAt = DateTime.Now;

            foreach (var item in data)
            {
                item.Id = 0;
                item.OptionUserId = OptionUserId;
                item.UpdatedAt = UpdatedAt;

                _context.Receipts.Add(item);
            }

            _context.SaveChanges();

            return Ok("治療案件已更新");
        }

        [HttpGet("ExportReceiptsPdf")]
        public async Task<IActionResult> ExportReceiptsPdf([FromQuery] int TreatmentId, string OrdreNo, string connectionId, [FromServices] IHubContext<ReportHub> hub)
        {

            if (!Directory.Exists(_reportPath))
                Directory.CreateDirectory(_reportPath);

            if (string.IsNullOrEmpty(OrdreNo))
                return BadRequest("未找到收據編號，請先進行存擋");

            var receipts = _context.Receipts
                .Where(p => p.TreatmentId == TreatmentId && p.OrdreNo == OrdreNo)
                .ToList();

            if (receipts.Count == 0)
                return BadRequest("此案件收據無資料");

            var treatments = _context.Treatments
                .Where(p => p.Id == TreatmentId && !p.IsDelete)
                .ToList();

            if (treatments.Count == 0)
                return BadRequest("未找到案件資料");

            await hub.Clients.Client(connectionId).SendAsync("ReportProgress", 5);

            var patients = _context.Patients
                .Where(p => p.Id == receipts.First().PatientId && !p.IsDelete)
                .ToList();

            if (treatments.Count == 0)
                return BadRequest("未找到病患資料");

            var filePath = string.Empty;

            await hub.Clients.Client(connectionId).SendAsync("ReportProgress", 20);

            if (string.IsNullOrEmpty(treatments.First().ReceiptUrl))
            {

                var fileNo = $"receipt_{OrdreNo}_{DateTime.Now:yyyyMMdd}";
                filePath = Path.Combine(_reportPath, $"{fileNo}.pdf" );

                await hub.Clients.Client(connectionId).SendAsync("ReportProgress", 40);

                // 製作收據 PDF
                ExportReceiptToPdf(receipts, patients, filePath);

                await hub.Clients.Client(connectionId).SendAsync("ReportProgress", 60);

                // 壓縮 PDF
                var compressPath = Path.Combine(_reportPath, $"{fileNo}_Compressed.pdf");
                CompressPdf(filePath, compressPath);

                await hub.Clients.Client(connectionId).SendAsync("ReportProgress", 80);

                // 刪除未壓縮 PDF
                System.IO.File.Delete(filePath);

                treatments.First().ReceiptUrl = Path.GetFileName(compressPath);
                filePath = compressPath;
            }
            else
            {
                filePath = Path.Combine(_reportPath, treatments.First().ReceiptUrl);

                await hub.Clients.Client(connectionId).SendAsync("ReportProgress", 80);
            }

            _context.SaveChanges();

            await hub.Clients.Client(connectionId).SendAsync("ReportProgress", 100);
            await hub.Clients.Client(connectionId).SendAsync("ReportFinished", "報表已完成");

            var fileBytes = System.IO.File.ReadAllBytes(filePath);
            return File(fileBytes, "application/pdf", "patients_report.pdf");
        }

        /// <summary>
        /// 壓縮PDF
        /// </summary>
        /// <param name="inputPath"></param>
        /// <param name="outputPath"></param>
        private void CompressPdf(string inputPath, string outputPath)
        {
            var FileName = "gs";

            string DebugMode = _configuration["WebSitSettings:DebugMode"];
            if (DebugMode == "true")
            {
                FileName = @"C:\Program Files\gs\gs10.05.1\bin\gswin64c.exe";
            }

            var psi = new ProcessStartInfo
            {
                FileName = FileName,
                Arguments = $"-sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook " +
                            "-dNOPAUSE -dQUIET -dBATCH " +
                            $"-sOutputFile=\"{outputPath}\" \"{inputPath}\"",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using var process = Process.Start(psi);
            process.WaitForExit();
        }

        /// <summary>
        /// 製作收據 PDF
        /// </summary>
        /// <param name="receipts"></param>
        /// <param name="filePath"></param>
        private void ExportReceiptToPdf(List<Receipt> receipts, List<Patient> patients, string filePath)
        {
            TextStyle.Default.FontFamily("Microsoft JhengHei");
            QuestPDF.Settings.CheckIfAllTextGlyphsAreAvailable = false;

            string[] receiptsTitle = { "繳款人收執聯", "單位存根聯", "單位扣底聯" };

            Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.MarginTop(20);
                    page.MarginBottom(20);
                    page.MarginLeft(50);
                    page.MarginRight(50);
                    page.DefaultTextStyle(x => x.FontSize(12));

                    page.Content().Column(column =>
                    {
                        foreach (var item in receiptsTitle)
                        {
                            // 標題與編號
                            column.Item().Row(row =>
                            {
                                row.ConstantItem(160).Text("");
                                row.RelativeItem().Text("厝邊頭家物理治療所收據").FontFamily("Microsoft JhengHei").Bold().FontSize(14);
                                row.ConstantItem(140).Text($"編號: {receipts.First().OrdreNo}").FontFamily("Microsoft JhengHei");
                            });

                            column.Item().LineHorizontal(2).LineColor(Colors.Black);

                            // 基本資訊
                            column.Item().Row(row =>
                            {
                                row.RelativeItem().Text($"姓名: {patients.First().FullName}").FontFamily("Microsoft JhengHei");
                                row.RelativeItem().Text($"生日: {patients.First().BirthDate?.ToString("yyyy/MM/dd") ?? ""}").FontFamily("Microsoft JhengHei");
                                row.RelativeItem().Text($"身分證字號: {patients.First().NationalId}").FontFamily("Microsoft JhengHei");
                            });

                            column.Item().LineHorizontal(1).LineColor(Colors.Black);

                            column.Item().Row(row =>
                            {
                                row.RelativeItem().Text("服務日期").FontFamily("Microsoft JhengHei");
                                row.RelativeItem().Text("項目").FontFamily("Microsoft JhengHei");
                                row.RelativeItem().Text("金額").FontFamily("Microsoft JhengHei");
                            });

                            column.Item().LineHorizontal(1).LineColor(Colors.Black);

                            column.Item().Row(row =>
                            {
                                // 左側：服務日期
                                row.ConstantItem(160).Text("114/6/3").FontFamily("Microsoft JhengHei");

                                // 右側：項目與金額
                                row.RelativeItem().Table(table =>
                                {
                                    table.ColumnsDefinition(columns =>
                                    {
                                        columns.RelativeColumn();
                                        columns.RelativeColumn();
                                    });

                                    foreach (var receipt in receipts)
                                    {
                                        table.Cell().Text(receipt.TreatmentItem).FontFamily("Microsoft JhengHei");
                                        table.Cell().Text("$" + receipt.TreatmentMoney.ToString());
                                    }

                                });
                            });

                            column.Item().LineHorizontal(2).LineColor(Colors.Black);

                            column.Item().Row(row =>
                            {
                                // 左側：印章
                                row.ConstantItem(80).PaddingTop(30).PaddingBottom(30).Text("治療所章：").FontFamily("Microsoft JhengHei");
                                row.ConstantItem(200).PaddingTop(30).PaddingBottom(30).Text("（此處可放圖片章）").FontFamily("Microsoft JhengHei"); //col.Item().Image("wwwroot/images/stamp.png", ImageScaling.FitHeight);

                                // 右側：開立欄位
                                row.RelativeItem().Table(table =>
                                {
                                    table.ColumnsDefinition(columns =>
                                    {
                                        columns.ConstantColumn(100);
                                        columns.ConstantColumn(100);
                                    });

                                    table.Cell().Text("總額：").FontFamily("Microsoft JhengHei");
                                    table.Cell().Text("$"+ receipts.Sum(t => t.TreatmentMoney).ToString("g0"));

                                    table.Cell().PaddingTop(15).PaddingBottom(15).Text("開立日期：").FontFamily("Microsoft JhengHei");
                                    table.Cell().PaddingTop(15).PaddingBottom(15).Text(receipts.First().UpdatedAt.ToString("yyyy/MM/dd"));

                                });
                            });

                            column.Item().LineHorizontal(2).LineColor(Colors.Black);

                            // 收執聯名稱
                            column.Item().Row(row =>
                            {
                                row.RelativeItem().AlignCenter().Text(item).FontFamily("Microsoft JhengHei");
                            });

                            if (item != receiptsTitle.Last())
                            {
                                column.Item().PaddingTop(10).PaddingBottom(10).LineHorizontal(1).LineColor(Colors.Grey.Medium);
                            }
                            
                        }
                        

                    });
                });
            })
        .GeneratePdf(filePath);
        }

    }
}
