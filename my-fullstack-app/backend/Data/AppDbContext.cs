﻿using Microsoft.EntityFrameworkCore;
using MyApi.Models;

namespace MyApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Menu> Menus => Set<Menu>();
        public DbSet<MenuGroup> MenuGroups => Set<MenuGroup>();
    }
}
