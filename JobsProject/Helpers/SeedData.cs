using JobsProject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JobsProject.Helpers
{
    public static class SeedData
    {
        public static void Valutes(JobsDbContext context)
        {
            if (!context.Valutes.Any())
            {
                List<Valute> list = new List<Valute>()
                {
                     new()
                {
                    Name = "Dinar",
                    Label = "din.",
                    ToDinars = 1
                },
                     new()
                {
                    Name = "Euro",
                    Label = "€",
                    ToDinars = 0.0085
                },
                     new()
                {
                    Name = "Dolar",
                    Label = "$",
                    ToDinars = 0.0096
                }

            };

                context.Valutes.AddRange(list);
                context.SaveChanges();
            }
            
        }

        public static void Technologies(JobsDbContext context)
        {
            if (!context.Technologies.Any())
            {
                List<Technology> list = new List<Technology>()
                {
                     new()
                {
                    Name = "PHP",
                },
                     new()
                {
                    Name = "C#",
                },     new()
                {
                    Name = "Xamarin",
                },     new()
                {
                    Name = "React",
                },     new()
                {
                    Name = "Java",
                },     new()
                {
                    Name = "Android",
                },
                     new()
                {
                    Name = "Python",
                }

            };

                context.Technologies.AddRange(list);
                context.SaveChanges();
            }

        }

    }
}
