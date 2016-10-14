import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

@Path("api/ninjax")
public class Coordinateservice {
    private Logger logger = LogManager.getFormatterLogger("ninjax");

    private static float startX=51.039920f;
    private static float startY=13.734095f;

    @GET
    @Path("ninjax")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getNinjaXCoordinates(String sessionHash) {
       return Response.ok().entity("{loc : { type: 'Point', coordinates: ["+51.039920+Math.random()/100+", "+13.734095+Math.random()/100+"] }, name: 'Hauptbahnhof'}").build();
    }
}
