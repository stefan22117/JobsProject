using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace JobsProject.Models
{
    public class JobsDbContext : DbContext
    {
        public JobsDbContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<Job> Jobs { get; set; }
        public DbSet<Valute> Valutes { get; set; }
        public DbSet<Bid> Bids { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Technology> Technologies { get; set; }

        public virtual DbSet<JobTechnology> JobTechnology { get; set; }
        public virtual DbSet<TechnologyUser> TechnologyUser { get; set; }

        public virtual DbSet<ChatUser> ChatUser { get; set; }
        public virtual DbSet<Chat> Chats { get; set; }
        public virtual DbSet<Message> Messages { get; set; }
        public virtual DbSet<WithdrawMoney> WithdrawMoneys { get; set; }
        public virtual DbSet<ChargeMoney> ChargeMoneys { get; set; }



    }
}
