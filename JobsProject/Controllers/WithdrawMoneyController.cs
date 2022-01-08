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
    public class WithdrawMoneyController : ControllerBase
    {
        public JobsDbContext context { get; set; }
        public WithdrawMoneyController(JobsDbContext _context)
        {
            context = _context;
        }
        // GET api/<WithdrawMoneyController>/byUserId/5
        [HttpGet("byUserId/{id}")]
        public async Task<ActionResult> GetByUserId(int id)
        {
            var list = await context.WithdrawMoneys
                .Where(x => x.UserId == id)
                .Include(x=>x.Valute)
                .OrderByDescending(x=>x.CreatedDateTime)
                .ToListAsync();
            return Ok(list);
        }
        // GET api/<WithdrawMoneyController>/byLastUserId/5
        [HttpGet("byLastUserId/{id}")]
        public async Task<ActionResult> GetLastByUserId(int id)
        {
            var lastWithdraw = await context.WithdrawMoneys.Where(x => x.UserId == id)
                .OrderByDescending(x=>x.Id)
                .FirstOrDefaultAsync();

            return Ok(lastWithdraw);
        }

        // POST api/<WithdrawMoneyController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] WithdrawMoney withdraw)
        {
            User user = await context.Users
                .Include(x=>x.Valute)
                .FirstOrDefaultAsync(x => x.Id == withdraw.UserId);
            Valute valute =await context.Valutes.FirstOrDefaultAsync(x => x.Id == withdraw.ValuteId);

            if (ModelState.IsValid && user != null && valute != null)
            {
            double amountInDinars = withdraw.Amount / valute.ToDinars;

            user.Total -= amountInDinars;

                withdraw.CreatedDateTime = DateTime.Now;

                context.WithdrawMoneys.Add(withdraw);
                context.Users.Update(user);

                await context.SaveChangesAsync();
                return Ok(withdraw);
            }
            else
            {
                return BadRequest();
            }
        }

    }
}
