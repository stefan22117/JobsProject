using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace JobsProject.Models.Dtos
{
    [NotMapped]
    public class PayFreelancerDto
    {
        public User User { get; set; }
        public Bid ActiveBid { get; set; }
        public Job Job { get; set; }
    }
}
