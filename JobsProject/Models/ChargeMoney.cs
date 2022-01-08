using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace JobsProject.Models
{
    public class ChargeMoney
    {
        public int Id { get; set; }
        public double Amount { get; set; }
        public bool Checked { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public string Status { get; set; }
        [NotMapped]
        public IFormFile ChargeOrderImage { get; set; }
        public string ImagePath { get; set; }
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public virtual User User { get; set; }
        public int? ValuteId { get; set; }
        [ForeignKey("ValuteId")]
        public virtual Valute Valute { get; set; }
    }
}
