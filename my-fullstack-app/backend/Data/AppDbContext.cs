using Microsoft.EntityFrameworkCore;
using MyApi.Models;

namespace MyApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Role> Roles => Set<Role>();
        public DbSet<UserRole> UserRoles => Set<UserRole>();
        public DbSet<Menu> Menus => Set<Menu>();
        public DbSet<MenuGroup> MenuGroups => Set<MenuGroup>();
        public DbSet<Patient> Patients => Set<Patient>();
        public DbSet<Treatment> Treatments => Set<Treatment>();
        public DbSet<DataType> DataTypes => Set<DataType>();
        public DbSet<DataTypeGroup> DataTypeGroups => Set<DataTypeGroup>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserRole>()
                .HasKey(ur => new { ur.UserId, ur.RoleId });

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.User)
                .WithMany(u => u.UserRoles)
                .HasForeignKey(ur => ur.UserId);

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId);

            // enum 轉 string 存入資料庫
            modelBuilder.Entity<Patient>()
                .Property(p => p.Gender)
                .HasConversion<string>();

            modelBuilder.Entity<Treatment>()
                .Property(t => t.Step)
                .HasConversion<string>();

            modelBuilder.Entity<Treatment>()
                .HasKey(t => t.Id); 

            modelBuilder.Entity<Treatment>()
                .HasOne(t => t.User)
                .WithMany(u => u.Treatments)
                .HasForeignKey(t => t.UserId);

            modelBuilder.Entity<Treatment>()
                .HasOne(t => t.Patient)
                .WithMany(p => p.Treatments)
                .HasForeignKey(t => t.PatientId);

        }

    }
}
