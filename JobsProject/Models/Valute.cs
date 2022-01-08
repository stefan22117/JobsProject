using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace JobsProject.Models
{
    public class Valute
    {
        private string namePlural = string.Empty;
        [Key]
        public int Id { get; set; }
        [Column(TypeName = "nvarchar(200)")]
        public string Name { get; set; }
        public string Label { get; set; }

        public double ToDinars { get; set; }
        [NotMapped]
        public string NamePlural 
        {
            get //get method for returning value
            {
                if (namePlural == string.Empty)
                {
                    //add s or es to Label

                    //ch, sh, s, x, or z += es 

                    if(Name.EndsWith("ch") ||
                     Name.EndsWith("sh") ||
                     Name.EndsWith("s") ||
                     Name.EndsWith("x") ||
                     Name.EndsWith("z"))
                    {
                        namePlural = Name + "es";
                    }
                    //else if y -= [last] += ies
                    else if (Name.EndsWith("y"))
                    {
                        namePlural = Name.Substring(0, Label.Length - 1) + "y";
                    }
                    //else += s
                    else
                    {
                        namePlural = Name + "s";
                    }

                }

                return namePlural;
            }
            set // set method for storing value in name field.
            {
                namePlural = value;
            }
        }

    }
}
