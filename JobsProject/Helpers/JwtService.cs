using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JobsProject.Helpers
{
    public class JwtService
    {
        private static string secureKey = "1234567890123456";//min 16
        public static string Generate(int id)
        {
            SymmetricSecurityKey symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secureKey));

            SigningCredentials credentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256Signature);

            JwtHeader header = new JwtHeader(credentials);

            JwtPayload payload = new JwtPayload(id.ToString(), null, null, null, DateTime.Today.AddDays(1)); //1 day

            JwtSecurityToken securityToken = new JwtSecurityToken(header, payload);


            return new JwtSecurityTokenHandler().WriteToken(securityToken);
        }

        public static JwtSecurityToken Verify(string jwt)
        {
            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();

            byte[] key = Encoding.ASCII.GetBytes(secureKey);

            tokenHandler.ValidateToken(jwt, new TokenValidationParameters { 
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuerSigningKey = true,
            ValidateIssuer = false,
            ValidateAudience = false
            }, out SecurityToken validatedToken);

            return (JwtSecurityToken) validatedToken;

        }
    }
}
