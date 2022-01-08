using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace JobsProject.Models
{
    public class Bid
    {
        [Key]
        public int Id { get; set; }
        public string Message { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public double Amount { get; set; }
        public bool Accepted { get; set; }

        public int? JobId { get; set; }

        [ForeignKey("JobId")]
        public virtual Job Job { get; set; }

        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }
    }
}
