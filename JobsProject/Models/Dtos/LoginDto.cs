using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace JobsProject.Models.Dtos
{
    [NotMapped]
    public class LoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
