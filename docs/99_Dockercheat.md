# DOCKER COMMANDS Cheat Sheet

<style>
.bck {
    background-color: #0F9D58;
    color: white;
}
.bck1 {
    background-color: #4285F4;
    color: white;
}
.bckg {
    background: lightgray
}
</style>


<table>
<colgroup>
<col style="width: 46%" />
<col style="width: 53%" />
</colgroup>
<thead>
<tr>
<th colspan="2" class="bck" style="text-align: right;">GENERAL DOCKER CHEAT SHEET
(Ref: https://spacelift.io/blog/docker-commands-cheat-sheet)</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2">Docker host IP: host.docker.internal or /sbin/ip
route|awk '/default/ { print $3 }'</td>
</tr>
<tr>
<td>docker version</td>
<td>Displays detailed info about your Docker CLI and daemon
versions.</td>
</tr>
<tr>
<td>docker system info</td>
<td></td>
</tr>
<tr>
<td>docker help</td>
<td></td>
</tr>
<tr>
<td>docker &lt;command&gt; --help</td>
<td></td>
</tr>
<tr>
<td class=bck1>Build Images</td>
<td></td>
</tr>
<tr>
<td>docker build .</td>
<td></td>
</tr>
<tr>
<td>docker build -t example:latest</td>
<td>Build the dockerfile and tag it as example:latest</td>
</tr>
<tr>
<td>docker build -f &lt;docker-file&gt;</td>
<td></td>
</tr>
<tr>
<td><p>docker -t ex:tag -f &lt;docker-file&gt;</p>
<p>--build-arg foo=bar</p></td>
<td>Build docker file, pass-in build arguments and docker definition
file</td>
</tr>
<tr>
<td>Docker build –pull .</td>
<td>Instructs Docker to pull updated versions of the images referenced
in FROM instructions in your Dockerfile, before building your new
image.</td>
</tr>
<tr>
<td>docker build --quiet .</td>
<td>Quietly build docker</td>
</tr>
<tr>
<td>RUNNING CONTAINER</td>
<td></td>
</tr>
<tr>
<td><p>docker run &lt;tag&gt; --rm [-it][-d]</p>
<p>&lt;arguments&gt; --name &lt;name&gt; --env foo=1</p>
<p>-p 8080:80</p>
<p>-v &lt;host-dir&gt;:&lt;container-dir&gt;</p>
<p>--network my-net</p>
<p>--restart unless-stopped</p>
<p>--privileged</p></td>
<td><p>--rm – remove container when it existed</p>
<p>-d detach your terminal after</p>
<p>-it attaches to terminal</p>
<p>--name gives it a name</p>
<p>--env creates a environment</p>
<p>-p host-port:container-port</p></td>
</tr>
<tr>
<td class=bck1>MANAGE CONTAINER</td>
<td></td>
</tr>
<tr>
<td class=bckg>Docker ps -a</td>
<td>List all containers</td>
</tr>
<tr>
<td>Docker attach &lt;container&gt;</td>
<td><p>Attach your terminal to the foreground process of the container
with the ID or name &lt;container&gt;</p>
<p><strong>TO DETACH PRESS CTRL+P and CTRL+Q</strong></p></td>
</tr>
<tr>
<td class=bckg>Docker commit &lt;container&gt; newtag:latest</td>
<td>Commit the running image to new tag</td>
</tr>
<tr>
<td>Docker inspect &lt;container&gt;</td>
<td>Obtain all the information about a container, in JSON format.</td>
</tr>
<tr>
<td class=bckg>Docker kill &lt;container&gt;</td>
<td>Send a SIGKILL signal to the foreground process running in a
container, to force it to stop</td>
</tr>
<tr>
<td>Docker rename container &lt;new-name&gt;</td>
<td></td>
</tr>
<tr>
<td>Docker pause &lt;container&gt;</td>
<td>docker unpause &lt;container&gt; works to unpause</td>
</tr>
<tr>
<td>Docker stop &lt;container&gt;</td>
<td></td>
</tr>
<tr>
<td>Docker rm [-f] container</td>
<td>Delete container by its ID -f force</td>
</tr>
<tr>
<td class=bck1>COPY to and FROM CONTAINER</td>
<td></td>
</tr>
<tr>
<td>Docker cp ex.txt container:/data</td>
<td>Copy ex.txt from host to the container</td>
</tr>
<tr>
<td>Docker co container:/data/ex.txt /tmp</td>
<td>Copy file from running container to host</td>
</tr>
<tr>
<td class=bck1>EXECUTE COMMANDS in CONTAINER</td>
<td></td>
</tr>
<tr>
<td>docker exec [-it] &lt;container&gt; &lt;cmd&gt;<br />
<br />
Ex: docker exec -it note1 bash</td>
<td>Execute a command in container [-it] will provide a interactive
shell</td>
</tr>
<tr>
<td class=bck1>ACCESS CONTAINER LOGS</td>
<td></td>
</tr>
<tr>
<td>Docker logs &lt;container&gt; [--follow] [-n 10]</td>
<td><p>This command streams the existing log output from a container
into your terminal window.<br />
[--follow] flag will continue to log</p>
<p>[-n 10] get last 10 lines</p></td>
</tr>
<tr>
<td>Docker stats &lt;container&gt;</td>
<td>Shows CPU memory usage etc</td>
</tr>
<tr>
<td class=bck1>IMAGE management</td>
<td></td>
</tr>
<tr>
<td>Docker images -ls</td>
<td></td>
</tr>
<tr>
<td>Docker rmi &lt;image&gt;</td>
<td>Delete the image</td>
</tr>
<tr>
<td>Docker tag &lt;image&gt; ex-tag:latest</td>
<td>Add a tag ex-tag:latest to the image</td>
</tr>
<tr>
<td>PUSH PULL</td>
<td></td>
</tr>
<tr>
<td>Docker push ex.com/user/image:latest</td>
<td>Push an image from your Docker host to a remote registry. The image
is identified by its tag, which must reference the registry.</td>
</tr>
<tr>
<td>Docker pull ex.com/user/image:latest</td>
<td>Manually pull the image. When the image’s tag omits a registry URL,
the Docker Hub registry will be used as the default.</td>
</tr>
<tr>
<td class=bck1>MANAGE NETWORK</td>
<td></td>
</tr>
<tr>
<td>docker create network my-network</td>
<td>Creates my-network that can be used to in docker run command – by
default it creates a bridge network</td>
</tr>
<tr>
<td>docker create network my-network -d host</td>
<td>[-d host] flag will create a host network</td>
</tr>
<tr>
<td><p>Docker network connect &lt;network&gt;</p>
<p>&lt;container&gt;</p></td>
<td>Connect container to existing network</td>
</tr>
<tr>
<td><p>Docker network disconnect &lt;network&gt;</p>
<p>&lt;container&gt;</p></td>
<td></td>
</tr>
<tr>
<td>Docker network rm &lt;network&gt;</td>
<td>Removes the network</td>
</tr>
<tr>
<td>Docker network ls</td>
<td>List all the network</td>
</tr>
<tr>
<td class=bck1>MANAGE VOLUME</td>
<td></td>
</tr>
<tr>
<td>Docker volume create my-volume</td>
<td>Creates a new volume called my-volume</td>
</tr>
<tr>
<td>Docker volume -ls</td>
<td>List volumes present in your host</td>
</tr>
<tr>
<td>Docker volume rm</td>
<td>Deletes a volume and destroys all data in it – Volume must not be in
use by any other container</td>
</tr>
<tr>
<td class=bck1>CONFIGURATION CONTEXT</td>
<td></td>
</tr>
<tr>
<td>docker context create my-context
--host=tcp://host:2376,ca=~/ca-file,cert=~/cert-file,key=~/key-file</td>
<td>Create a new context called my-context to connect to a specified
Docker host</td>
</tr>
<tr>
<td>docker context update &lt;context&gt;</td>
<td>Modify the configuration of a named context; the command accepts the
same arguments as docker context create</td>
</tr>
<tr>
<td>docker context ls</td>
<td>List the contexts available in your Docker config file</td>
</tr>
<tr>
<td>docker context use &lt;context&gt;</td>
<td>Switch to a named context. Subsequent docker commands will be
executed against the Docker host configured in the newly selected
context.</td>
</tr>
<tr>
<td>docker context rm &lt;context&gt;</td>
<td>Deletes the context</td>
</tr>
<tr>
<td colspan="2"  class=bck1>CREATE SBOMS (https://docs.docker.com/engine/sbom/</td>
</tr>
<tr>
<td>docker sbom ex-image:latest</td>
<td>Produce an SBOM for the image tagged example-image:latest. The SBOM
will be shown in your terminal.</td>
</tr>
<tr>
<td>docker sbom ex-image:latest --output m.txt</td>
<td>Same as aboive – but output us saved in m.txt</td>
</tr>
<tr>
<td>docker sbom ex-image:latest --format spdx-json</td>
<td>Produce an SBOM in a standard machine-parseable format, such as SPDX
(spdx-json), CycloneDX (cyclonedx-json), or Syft JSON (syft-json).</td>
</tr>
<tr>
<td class=bck1>SCAN For Vulnerabilities</td>
<td></td>
</tr>
<tr>
<td>docker scan example-image:latest</td>
<td>– Scan for vulnerabilities in the image tagged example-image:latest.
The results will be shown in your terminal.</td>
</tr>
<tr>
<td>docker scan ex-image:latest --file Dockerfile</td>
<td>– The --file argument supplies the path to the Dockerfile that was
used to build the image. When the Dockerfile is available, more detailed
vulnerability information is produced.</td>
</tr>
<tr>
<td>docker scan example-image:latest --severity high</td>
<td>Only report vulnerabilities that are high severity or higher. The
--severity flag also supports low and medium values</td>
</tr>
<tr>
<td class=bck1>Docker HUB Account</td>
<td></td>
</tr>
<tr>
<td>Docker login</td>
<td></td>
</tr>
<tr>
<td>Docker logout</td>
<td></td>
</tr>
<tr>
<td>Docker search nginx</td>
<td>Searches Docker Hub for images matching the supplied search term
(nginx, in this example).</td>
</tr>
<tr>
<td class=bck1>CLEANING UP RESOURCES</td>
<td></td>
</tr>
<tr>
<td>docker system prune [-a] [--volumes]</td>
<td><p>Removes unused data, including dangling image layers (images with
no tags).</p>
<p>[-a] – option Extends the prune process by deleting all unused
images, instead of only dangling ones.</p>
<p>[--volumes] prune volume and will delete any volumes that aren’t used
by a container.</p></td>
</tr>
<tr>
<td>Docker image prune [-a]</td>
<td></td>
</tr>
<tr>
<td>Docker network prune</td>
<td></td>
</tr>
<tr>
<td>Docker volume prune</td>
<td></td>
</tr>
<tr>
<td>Docker system df</td>
<td>Reports your Docker installation’s total disk usage.</td>
</tr>
</tbody>
</table>



