using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace JobsProject.Models
{
    public class WithdrawMoney
    {
        [Key]
        public int Id { get; set; }
        public double Amount { get; set; }
        public string BankAccount { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public virtual User User { get; set; }
        public int? ValuteId { get; set; }
        [ForeignKey("ValuteId")]
        public virtual Valute Valute { get; set; }
    }
}
