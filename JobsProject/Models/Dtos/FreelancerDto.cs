using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace JobsProject.Models.Dtos
{
    [NotMapped]
    public class FreelancerDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Avatar { get; set; }
        public string Description { get; set; }
        public string Password1 { get; set; }
        public string Password2 { get; set; }
        public int ValuteId { get; set; }
        public IFormFile NewAvatar { get; set; }
        public int[] Technologies { get; set; }

    }
}
