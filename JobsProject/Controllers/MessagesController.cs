using JobsProject.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace JobsProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private JobsDbContext context;
        public MessagesController(JobsDbContext _context)
        {
            context = _context;
        }
        [HttpGet("byUserId/{id}")]
        public async Task<ActionResult> GetByUserId(int id)
        {
            var messagesById = await context.Messages
                //.Where(x => x.MUSender.Select(mus => mus.UserId).Contains(id)
                //.Where(x => x.MessageUser.Count > 0)
                //||
                //x.MUReceiver.Select(mur => mur.UserId).Contains(id)
                //)
                .ToListAsync();
            //sve poruke



            return Ok(messagesById);
        }
    }
}
