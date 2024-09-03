# :scroll: :robot: Receipt Processor :robot: :scroll:

A simple application for providing scores based on scanned receipt data.

## :microscope: Local development

The application can be run locally using Docker and the following commands.

> [!NOTE]
>
> A functioning Docker installation is a prerequisite for this application.
> Docker can be installed by following their [Docker installation guides].

```bash
docker build -t receipt-processor .
docker run -p 3000:3000 -d receipt-processor
```

Once the commands have been run successfully, the site will be available at
http://localhost:3000.

### :raised_hand: Stopping the running container

To bring down the running container, use the following commands to first note
the container ID of the running application and then request that it be stopped.

```bash
docker ps
docker stop <container_id_indicated_by_prior_command>
```

<!-- Link references. -->
> [Docker installation guides]: https://docs.docker.com/get-started/get-docker/