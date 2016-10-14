import java.io.IOException;
import java.net.InetAddress;
import java.net.URI;
import java.net.UnknownHostException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;

import javax.ws.rs.core.UriBuilder;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.glassfish.jersey.jackson.JacksonFeature;
import org.glassfish.jersey.jdkhttp.JdkHttpServerFactory;
import org.glassfish.jersey.server.ResourceConfig;

public class Main {
    private static Logger logger = LogManager.getFormatterLogger("ninjax");
    private static final int PORT = 8085;

    public static void main(String[] args) {
        ResourceConfig resourceConfig = new ResourceConfig();
        resourceConfig.packages("ninjax");
        resourceConfig.register(JacksonFeature.class);
        resourceConfig.register(CORSFilter.class);
        logger.info("Jersey set up");

        String hostName = "localhost";
        try {
            hostName = InetAddress.getLocalHost().getCanonicalHostName();
        } catch (UnknownHostException e) {
            e.printStackTrace();
            logger.error("Could not get hostname.", e);
        }

        URI uri = UriBuilder.fromUri("http://" + hostName + "/").port(PORT).build();

        JdkHttpServerFactory.createHttpServer(uri, resourceConfig);
        logger.info("Server started");
    } 
}
