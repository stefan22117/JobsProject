using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace JobsProject.Models.Dtos
{
    [NotMapped]
    public class UnreadMessageDto
    {
        public int UserId { get; set; }
        public int Number { get; set; }
    }
}
