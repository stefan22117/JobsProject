using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace JobsProject.Models
{
    [NotMapped]
    public class HubMessage
    {
        //ne koristi se, obrisati
        public string User { get; set; }
        public string Message { get; set; }
    }
}
