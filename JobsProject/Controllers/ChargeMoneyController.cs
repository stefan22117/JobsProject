using JobsProject.Helpers.Hubs;
using JobsProject.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace JobsProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChargeMoneyController : ControllerBase
    {
        public JobsDbContext context { get; set; }
        public IHubContext<ChatHub> chatHub;
        public ChargeMoneyController(JobsDbContext _context, IHubContext<ChatHub> _chatHub)
        {
            context = _context;
            chatHub = _chatHub;
        }
        // GET: api/<ChargeMoneyController>
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            List<ChargeMoney> list = await context.ChargeMoneys
                .Include(x=>x.User)
                .OrderByDescending(x => x.CreatedDateTime)
                .ToListAsync();
            return Ok(list);
        }

        // GET api/<ChargeMoneyController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }
        [HttpGet("byUserId/{id}")]
        public async Task<ActionResult> GetByUserId(int id)
        {
            var list = await context.ChargeMoneys
                .Where(x => x.UserId == id)
                .Include(x=>x.Valute)
                .OrderByDescending(x => x.CreatedDateTime)
                .ToListAsync();
            return Ok(list);
        }


        [HttpGet("getUncheckedNumber/{id}")]
        public async Task<ActionResult> GetUncheckedNumber(int id)
        {
            var listOfCharges = await  context.ChargeMoneys
                .Where(x => x.UserId == id)
                .Where(x => x.Status != "pending")
                .Where(x => x.Checked == false)
                .ToListAsync();

            return Ok(listOfCharges.Count);
        }    
        
        [HttpGet("getAdminChargesNumber/{id}")]
        public async Task<ActionResult> GetAdminChargesNumber(int id)
        {
            User user = await context.Users.FirstOrDefaultAsync(x=>x.Id == id);
            if(user == null)
            {
                return NotFound();
            }
            if(user.Role.ToLower() != "admin")
            {
                return BadRequest();
            }


            var listOfCharges = await  context.ChargeMoneys
                .Where(x => x.Status == "pending")
                .ToListAsync();

            return Ok(listOfCharges.Count);
        }
        
        [HttpPost("checkCharge/{id}")]
        public async Task<ActionResult> CheckCharge(int id)
        {
            ChargeMoney charge = await context.ChargeMoneys.FirstOrDefaultAsync(x => x.Id == id);
            if(charge == null)
            {
                return NotFound();
            }
            if(charge.Checked || charge.Status == "pending")
            {
                return BadRequest();
            }

            charge.Checked = true;
            context.ChargeMoneys.Update(charge);
            await context.SaveChangesAsync();


            var listOfCharges = await context.ChargeMoneys
                .Where(x => x.UserId == charge.UserId)
                .OrderByDescending(x => x.CreatedDateTime)
                .ToListAsync();

            return Ok(listOfCharges);
        }


        // POST api/<ChargeMoneyController>
        [HttpPost]
        public async Task<ActionResult> Post([FromForm] ChargeMoney charge)
        {
            charge.CreatedDateTime = DateTime.Now;
            charge.Status = "pending";

            await context.ChargeMoneys.AddAsync(charge);

            await context.SaveChangesAsync();

            //updating photo after charge save
            string ext = Path.GetExtension(charge.ChargeOrderImage.FileName);
            string name = charge.UserId.ToString() + "-"
                    + charge.Id.ToString() + "-"
                    + DateTime.Now.Ticks
                    + ext;

            charge.ImagePath = name;
            context.ChargeMoneys.Update(charge);
            await context.SaveChangesAsync();

            string path = Path.Combine(Directory.GetCurrentDirectory(), "ClientApp/public/media/chargeOrderImages", name);
            using (Stream stream = new FileStream(path, FileMode.Create))
            {
                charge.ChargeOrderImage.CopyTo(stream);
            }

            await chatHub.Clients.All.SendAsync("PostingChargeOrder");
            return Ok();
        }

        // POST api/<ChargeMoneyController>/accept/5
        [HttpPost("accept/{id}")]
        public async Task<ActionResult> AcceptCharge(int id)
        {
            ChargeMoney charge = await context.ChargeMoneys.FirstOrDefaultAsync(x => x.Id == id);
            if(charge == null)
            {
                return NotFound();
            }
            User user = await context.Users
                .Include(x=>x.Valute)
                .FirstOrDefaultAsync(x => x.Id == charge.UserId);


            Valute valute = await context.Valutes.FirstOrDefaultAsync(x => x.Id == charge.ValuteId);
            if (user == null || valute == null)
            {
                return NotFound();
            }



            user.Total += charge.Amount + charge.Amount * valute.ToDinars;
            charge.Status = "accepted";


            context.ChargeMoneys.Update(charge);
            context.Users.Update(user);
            await context.SaveChangesAsync();


           await chatHub.Clients.All.SendAsync("HandleChargeOrder");

            return Ok();
        }
        
        // POST api/<ChargeMoneyController>/decline/5
        [HttpPost("decline/{id}")]
        public async Task<ActionResult> DeclineCharge(int id)
        {
            ChargeMoney charge = await context.ChargeMoneys.FirstOrDefaultAsync(x => x.Id == id);

            if (charge == null)
            {
                return NotFound();
            }
            User user = await context.Users
                .Include(x => x.Valute)
                .FirstOrDefaultAsync(x => x.Id == charge.UserId);
            if (user == null)
            {
                return NotFound();
            }
            charge.Status = "declined";

            context.ChargeMoneys.Update(charge);
            await context.SaveChangesAsync();

            var listOfCharges = await context.ChargeMoneys
              .Where(x => x.UserId == user.Id)
              .Where(x => x.Status != "pending")
              .Where(x => x.Checked == false)
              .ToListAsync();

            await chatHub.Clients.All.SendAsync("HandleChargeOrder", listOfCharges);

            return Ok();
        }

        // PUT api/<ChargeMoneyController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<ChargeMoneyController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
