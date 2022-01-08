using JobsProject.Helpers;
using JobsProject.Models;
using JobsProject.Models.Dtos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace JobsProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        public JobsDbContext context { get; set; }
        public AuthController(JobsDbContext _context)
        {
            context = _context;
        }
        // GET: api/<AuthController>
        [HttpGet]
        public async Task<IEnumerable<User>> Get()
        {
            return await context.Users.ToListAsync();
        }

        // GET api/<AuthController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            User user =  await context.Users.FirstOrDefaultAsync(x => x.Id == id);
            if(user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        // POST api/<AuthController>
        [HttpPost("login")]
        public async Task<IActionResult> PostLogin([FromBody] LoginDto login)
        {
            User user = await context.Users
                .Include(x => x.Valute)
                .FirstOrDefaultAsync(x => x.Email == login.Email);
            if (user == null)
            {
                return BadRequest(new { email = "User does not exist" });
            }

            if (!BCrypt.Net.BCrypt.Verify(login.Password, user.Password))
            {
                
                return BadRequest(new { password = "Wrong password" });

            }

            var jwt = JwtService.Generate(user.Id);

            Response.Cookies.Append("jwt", jwt, new CookieOptions
            {
                HttpOnly = true
            });

            return Ok(user);
        }
        [HttpPost("register")]
        public async Task<ActionResult> PostRegister([FromBody] RegisterDto register)
        {
            List<dynamic> errors = new List<dynamic>();
            User userNameExists = await context.Users.FirstOrDefaultAsync(x => x.Name == register.Name);
            if (userNameExists != null)
            {
                errors.Add(new { name = "User with that name already exists" });
                //return BadRequest(new { name = "User already exists" });
            }
            User userEmailExists = await context.Users.FirstOrDefaultAsync(x => x.Email == register.Email);
            if (userEmailExists != null)
            {
                errors.Add(new { email = "User with that email already exists" });
                //return BadRequest(new { email = "User already exists" });
            }

            if (errors.Count > 0)
            {
                return BadRequest(errors);
            }

            Valute dinars = await context.Valutes.FirstOrDefaultAsync(x => x.Label == "din.");
            User user = new User
            {
                Name = register.Name,
                Email = register.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(register.Password1),
                ValuteId = dinars.Id
            };

            if(context.Users.Any() == false)
            {
                user.Role = "admin";
            }
            else
            {
                user.Role = "freelancer";

            }

            context.Users.Add(user);
            await context.SaveChangesAsync();

            return Ok(user);
            //return //created()201 ??
        }

        [HttpGet("user")]
        public async Task<IActionResult> UserByToken()
        {
            try
            {
                string jwt = Request.Cookies["jwt"];

                JwtSecurityToken token = JwtService.Verify(jwt);
                int userId = int.Parse(token.Issuer);

                User user = await context.Users
                    .Include(x=>x.Valute)
                    .FirstOrDefaultAsync(x => x.Id == userId);

                return Ok(user);
            }
            catch (Exception)
            {
                return Unauthorized();
            }
        }
       

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt");

            return Ok(new
            {
                message = "success logout"
            });

        }
    }
}
