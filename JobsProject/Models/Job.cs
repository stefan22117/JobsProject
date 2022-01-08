using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace JobsProject.Models
{
    public class Job
    {
        [Key]
        public int Id { get; set; }
        [Column(TypeName = "nvarchar(200)")]
        public string Title { get; set; }
        [Column(TypeName = "nvarchar(1024)")]
        public string Description { get; set; }

        public DateTime CreatedDateTime { get; set; }
        public DateTime UpdatedtedDateTime { get; set; }

        public bool Reserved { get; set; }
        public bool Finished { get; set; }
        public string PaymentType { get; set; }
        public double MinAmount { get; set; }
        public double MaxAmount { get; set; }

        public int ValuteId { get; set; }

        [ForeignKey("ValuteId")]
        public virtual Valute Valute { get; set; }
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        [NotMapped]
        public virtual List<Bid> Bids { get; set; } = new List<Bid>();

        //[NotMapped]
        public virtual List<JobTechnology> JobTechnology { get; set; } = new List<JobTechnology>();

    }
}
