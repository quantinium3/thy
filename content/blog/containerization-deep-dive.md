---
title: Containerization Deep Dive
description: A deep dive into docker covering images, dockerfiles, multi-stage builds and docker compose.
author: quantinium
date: '2026-08-22'
categories:
  - docker
  - containerization
  - devops
published: true
cover_image:
---

This a deep dive into containers, images, dockerfiles, multi-stage builds, docker compose and some more stuff i'll go through.

# Containers
Containers are just a linux process which by the use of various linux features have been given the illusion of isolation. Some of the features that are:
- Namespaces: It partitions kernel resources such that one set of processes sees one set of resources, while another set of processes sees a different set of resources. The feature works by assigning the same namespace type to a set of resources and processes, but allowing those namespaces to refer to distinctly isolated environments. This provides the illusion that a process or a process group is the sole user of the system's hardware and software resources. There are various such as `pid`, `net`, `mnt`, `uts`, `ipc`, `user`, etc.
- Cgroups: It is a kernel feature that limits, accounts for, and isolates the resource usage (CPU, memory, disk I/O, etc.) of a collection of processes.
- A root filesystem swap: This maps the process `/` to unpacked image using `mnt` namespace and `chroot` so that the process can't see the hosts real filesystem.
- Kernel Sharing & Distro Portability: Containers avoid the overhead of a guest OS by sharing the host's Linux kernel. Since a Linux distribution is essentially custom user-space packages sitting atop a common kernel, you can run an Alpine, Ubuntu, or Fedora rootfs on any host without virtualization

Docker itself didnt invent anything of this. `docker run` in simple words just unpacks an docker image into a directory, `unshare` a fresh set of namespaces, `chroot` into that directory, apply cgroups limits and then `exec` the process. This is the basis of a container. Because this architecture relies on standardized kernel primitives and open image formats (OCI), any compliant runtime like `podman` or `containerd` can execute the exact same image.

> For a more deeper dive refer to [Devops: Virtual Machines, Containers and Isolates](https://quantinium.dev/learnings/devops_virtual-machines-containers-isolates)

# Images vs Containers
The relationship between images and containers is analogous to the relationship between a program and a process:
- Image (Program): A static, read-only stack of filesystem layers and metadata (environment variables, default entrypoints, ports). Like an executable stored on disk, it contains the code, runtime, and libraries needed to run the application.
- Container (Process): An active, isolated running instance of an image in memory. Like an OS process, it has its own runtime state, isolated process space (PID), dedicated network stack, and a temporary, thin read-write layer mounted over the base image layers.

# Writing a Dockerfile
For this section, I'll be using a small `node` app but everything can easily be applicable to other languages.
```js
import http from "node:http";

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'hello from inside a container' }));
    return;
  }
  res.writeHead(404);
  res.end();
});

server.listen(3000, () => console.log('listening on :3000'));
```

The most naive dockerfile we can write for this may look like this.
```dockerfile
FROM node:26
WORKDIR /app
COPY . .
RUN npm ci
EXPOSE 3000
CMD ["node", "src/index.js"]
```

This may feel similar to commands that we write in our shell but just in dockerfile flavor. Let's understand what is happening:
- `FROM node:26`: This fetches the base `node:26` image from [dockerhub](https://hub.docker.com/_/node) which acts as the base layer.
- `WORKDIR /app`: This sets up the current working directory to be `/app`
- `COPY . .`: Copies contents from the `.`(path where `docker run` command is run from ) to `.`(current working directory inside container).
- `RUN npm ci`: Similar to running `npm i` but `ci` installs packages listed in the lockfile.
- `EXPOSE 3000`: This is just for documentation and doesnt have any effect on image.
- `CMD ["node", "src/index.js"]`: Shell command telling how to run the software. This always come at end.

Now if we build our image using the following command we would get the following as output
```sh
$ docker build -f Dockerfile -t temp .
[+] Building 132.5s (9/9) FINISHED
 => [internal] load build definition from Dockerfile
 => => transferring dockerfile: 173B
 => [internal] load metadata for docker.io/library/node:26
 => [internal] load .dockerignore
 => => transferring context: 2B
 => [1/4] FROM docker.io/library/node:26@sha256:0557ac14e0d45d02ed563067b82856ca5e7aa3437fa28d98d4350ea9c3d9494a
 => => resolve docker.io/library/node:26@sha256:0557ac14e0d45d02ed563067b82856ca5e7aa3437fa28d98d4350ea9c3d9494a
 => => sha256:90db3d101e9fb5549f113fda240051591ff51945aa88f57570a37025f2cdb7d9 446B / 446B
 => => sha256:ac79beb9bb0035eca05825d2ad8785216626b505bf201dbad3cfac4e668e6b36 1.25MB / 1.25MB
 => => sha256:9d297ec8a3b2192f783e9f6d4f8d00d5d978f4337ef094b1123c3cd5011a1dbf 58.55MB / 58.55MB
 => => sha256:88faacef525d7afe43fd1445d099f37dcff85b8f1e75d2f4f9d8bd63b228d7dd 3.33kB / 3.33kB
 => => sha256:d32ed818f20fae825717c40dbc77cd4ed4bcefad6ba95a83f8c4f3c1f8631c31 211.66MB / 211.66MB
 => => sha256:c5a4625b533197abb25ea2a32be06c59c984d97c3c2dc9952e0b76f2e81ee0d2 64.41MB / 64.41MB
 => => sha256:6b02178232c403d8a6d5b460ad955daba177c38e178ed7dd417e5c4d748e948d 24.04MB / 24.04MB
 => => sha256:3af9207d37990175f61d5ce9faa0c7373ffcd2d6da1b6ba0a9ca9d61f8f47cc9 48.50MB / 48.50MB
 => => extracting sha256:3af9207d37990175f61d5ce9faa0c7373ffcd2d6da1b6ba0a9ca9d61f8f47cc9
 => => extracting sha256:6b02178232c403d8a6d5b460ad955daba177c38e178ed7dd417e5c4d748e948d
 => => extracting sha256:c5a4625b533197abb25ea2a32be06c59c984d97c3c2dc9952e0b76f2e81ee0d2
 => => extracting sha256:d32ed818f20fae825717c40dbc77cd4ed4bcefad6ba95a83f8c4f3c1f8631c31
 => => extracting sha256:88faacef525d7afe43fd1445d099f37dcff85b8f1e75d2f4f9d8bd63b228d7dd
 => => extracting sha256:9d297ec8a3b2192f783e9f6d4f8d00d5d978f4337ef094b1123c3cd5011a1dbf
 => => extracting sha256:ac79beb9bb0035eca05825d2ad8785216626b505bf201dbad3cfac4e668e6b36
 => => extracting sha256:90db3d101e9fb5549f113fda240051591ff51945aa88f57570a37025f2cdb7d9
 => [internal] load build context
 => => transferring context: 1.35kB
 => [2/4] WORKDIR /app
 => [3/4] COPY . .
 => [4/4] RUN npm ci
 => exporting to image
 => => exporting layers
 => => exporting manifest sha256:ff99d50e6179275f6f4c3a885b46cc85cb94b6899ec44b22fd10e7b611ab2c18
 => => exporting config sha256:9249db08a5f693708fefd453860a65c2e497fac2b44a7ccaaaa9231311d0ba2b
 => => exporting attestation manifest sha256:81b60d46e9ea8f4097656ae82e4d3b8069db82084c7882db87c0c8ecb3d87bec
 => => exporting manifest list sha256:fe54e1f3ae4821401715626d62e3c5d639d4924fc97d39966db2f4125f82359b
 => => naming to docker.io/library/temp:latest
 => => unpacking to docker.io/library/temp:latest
```

As told above docker image are built using read only filesystem laters stacked upon each other. As we can see in the output with `[n/4]` steps. we get 8 layers from base node image and then 3 more layers from `[{2,3,4}/4]` are being added on top of the node image. When we run this container a thin read-write layer would be created on top of all these layers where the program can do their stuff.

Each layer is uniquely identified by its SHA hash. If a future build step generates an identical hash, it means the content hasn't changed—Docker skips the build step entirely and reuses the cached layer, saving both build time and disk space.
```sh
$ docker run -p 3000:3000 temp
# -p forwards incoming host traffic on port 3000 to port 3000 inside the container
# Format: -p <HOST_PORT>:<CONTAINER_PORT>
listening on :3000

$ curl localhost:3000
{"message":"hello from inside a container"}⏎
```

## Optimizing Images
We can check the size of the image using
```sh
$ docker image ls temp
IMAGE         ID             DISK USAGE   CONTENT SIZE   EXTRA
temp:latest   007599a47077       1.62GB          409MB    U

$ dive temp # truncated output
117 MB  FROM blobs
48 MB  RUN /bin/sh -c set -eux;     apt-get update;     apt-get install -y
177 MB  RUN /bin/sh -c set -eux;     apt-get update;     apt-get install -y
588 MB  RUN /bin/sh -c set -ex;     apt-get update;     apt-get install -y
8.9 kB  RUN /bin/sh -c groupadd --gid 1000 node   && useradd --uid 1000 --gid node
197 MB  RUN /bin/sh -c ARCH= && dpkgArch="$(dpkg --print-architecture)"
5.3 MB  RUN /bin/sh -c set -ex   && export GNUPGHOME="$(mktemp -d)"
388 B  COPY docker-entrypoint.sh /usr/local/bin/ # buildkit
0 B  WORKDIR /app
867 B  COPY . . # buildkit
1.3 MB  RUN /bin/sh -c npm ci # buildkit
```

As we can see most of the image size comes from before we run `WORKDIR /app` therefore `FROM node:26`.

### Choosing a small base image
Since a lot of image size can come from the base image, we can try to choose a smaller base image. If we go to [node:26](https://hub.docker.com/_/node), we can find various images such as
- `node:26-bookworm`: This is similar to `node:26` which uses the debian bookworm as base.
- `node:26-alpine`: This image uses alpine linux instead of debian which makes it way lighter but strips glibc with musl.
- `node:26-slim`: This is stripped debian image.

> Good read: [Why I Will Never Use Alpine Linux Ever Again](https://martinheinz.dev/blog/92)

```sh
$ docker image ls temp # with node:26
IMAGE         ID             DISK USAGE   CONTENT SIZE
temp:latest   cfaacfa01bdf       1.62GB          409MB

$ docker image ls temp # with node:26-slim
IMAGE         ID             DISK USAGE   CONTENT SIZE
temp:latest   346e990f3a54        328MB         80.4MB

$ docker image ls temp # with node:26-alpine
IMAGE         ID             DISK USAGE   CONTENT SIZE
temp:latest   6d2f7d5068b1        234MB         58.3MB
```

### Order Instructions by Volatility (Layer Caching)
Since docker images are made up of cacheable layers, the way we write dockerfile, we can make docker cache different layers so that the build step is faster. We put frequently changing lines different from stable dependencies. We can change the dockerfile as follows.
```dockerfile
FROM node:26-slim
WORKDIR /app

# 1. Dependency layer (infrequently changed -> cached)
COPY package*.json ./
RUN npm ci

# 2. Source code layer (frequently changed -> rebuilds only from here down)
COPY . .

EXPOSE 3000
CMD ["node", "src/index.js"]
```

### Use .dockerignore
As shown in the build output (`=> [internal] load .dockerignore`), Docker checks `.dockerignore` before sending files to the build daemon. Just like .gitignore, it excludes heavy or sensitive files (e.g., node_modules, dist, .git) so you don't accidentally overwrite container builds or bloat the build context.
```
.git
node_modules
npm-debug.log
.env
*.md
```

### Combine `RUN` commands and clean up in same layer
Each RUN instruction creates a persistent layer. Clean up package manager caches in the same command so deleted files aren't permanently baked into that layer.
```dockerfile
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
 && rm -rf /var/lib/apt/lists/*
```

### Use Non-Root Users
Node images have a default non-root user `node` which can be set as the user that runs the `CMD` command. If the images dont have default non-root user, we can create using
```dockerfile
RUN adduser -D appuser
USER appuser
```

### Leverage BuildKit Cache Mounts
Keep package manager caches between builds without baking them into the final image:
```dockerfile
RUN --mount=type=cache,target=/root/.npm npm ci
```

### Use Multi-Stage Builds
Some software that is compiled and then deployed can reduce the image size and attack surface with this. Since build environments such as (compilers, SDKs, devDependencies) are big and not needed during runtime, they can easily be removed from the final runtime image. For example, a react app's dockerfile may look like:

```dockerfile
# build image
FROM node:26 AS builder
WORKDIR /app

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .

RUN npm run build

# runtime image
FROM node:26-slim AS runner # or node:26-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY --link --from=builder /app/dist ./dist

RUN --mount=type=cache,target=/root/.npm npm install serve --omit=dev

USER node

EXPOSE 3000

CMD ["npx", "serve", "-s", "dist", "-l", "3000"]
```
As shown we build the `dist` directory in the build step and just copy the `dist` directory as that is the content we need to deploy, thus stripping every unneeded dependencies.

# Docker Compose
When an application requires multiple containers such as a Node.js app, a PostgreSQL database, and other services. Running `docker run` for each container becomes tedious, and the commands can get excessively long. Instead, you can use a compose.yaml file to store all the configuration needed to run the containers together. Docker Compose lets you declare the whole stack in a single YAML file and bring it up with one command.

```yml
services:
  app:
    # for local image building
    build:
      context: .
      dockerfile: Dockerfile
    # from a container registry
    # image: ghcr.io/quantinium/temp/temp:6dff19c
    ports:
      - '3000:3000' # <HOST_PORT:CONTAINER_PORT> mapping
    # environment variables used in application
    environment:
      DATABASE_URL: postgres://${DB_USER}:${DB_PASSWORD}@db:5432/${DB_NAME}
    # will only run after postgres container is healthy
    depends_on:
      db:
        condition: service_healthy
    # restart a container unless you explicitly stop it yourself
    restart: unless-stopped

  db:
    image: postgres:18-alpine
    # set shared memory limit when using docker compose
    shm_size: 128mb
    # environment variables for postgres container
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    # not exposing to the host, only reachable by other containers on the network
    expose:
      - "5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U ${DB_USER} -d ${DB_NAME}']
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  pgdata:
```

Run the container using
```sh
$ docker compose up -d
[+] Running 3/3
 ✔ Network myapp_default   Created
 ✔ Container myapp-db-1    Healthy
 ✔ Container myapp-app-1   Started

$ docker compose ps
NAME           IMAGE                COMMAND                  STATUS
myapp-app-1    myapp-app            "docker-entrypoint.s…"   Up 4 seconds
myapp-db-1     postgres:18-alpine   "docker-entrypoint.s…"   Up 9 seconds (healthy)

$ curl localhost:3000
{"message":"hello from inside a container"}
```

The `${DB_USER}` style references in the compose file above are compose interpolation, not something passed into the container automatically. Compose reads them from a `.env` file sitting next to compose.yaml at the time it parses the file, before any container starts:

```
# .env
DB_USER=appuser
DB_PASSWORD=supersecret
DB_NAME=myapp
```

We can verify what compose actually resolves these to without starting anything:

```yaml
services:
  app:
    environment:
      DATABASE_URL: postgres://appuser:supersecret@db:5432/myapp
  db:
    environment:
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD: supersecret
      POSTGRES_DB: myapp
```

## Networks
Every Docker network uses a driver that determines how it behaves such as:
- bridge — the default. A private internal network on the host, containers on it get their own IP, NAT'd out to the internet. This is what compose sets up automatically.
- host — no network namespace isolation at all; the container shares the host's network stack directly. No port mapping needed, but you lose all network isolation and can't run two containers on the same port.
- overlay — spans multiple Docker hosts (Swarm/multi-node setups). Not relevant for single-host compose.
- none — no networking at all.
- macvlan — gives a container its own MAC address, making it appear as a physical device on your LAN. Niche, mostly for legacy apps that need to be directly addressable.

Docker actually ships a single default bridge network (`bridge`) that every container joins if you don't specify one. But containers on that default bridge can only reach each other by IP (there's no DNS resolution by container name on it). This is why raw docker run setups often resort to `--link` or hardcoded IPs.

Compose sidesteps this entirely by creating its own user-defined bridge network per project (`myapp_default`) instead of using the default one. User-defined networks get Docker's embedded DNS server, so the hostname `db` resolves to the right container's IP and that's what lets `DATABASE_URL` reach it at `db:5432`.

```sh
$ docker network create mynet
$ docker run -d --network mynet --name db postgres:18-alpine
$ docker run --rm --network mynet alpine getent hosts db
172.20.0.2      db
```

## Volumes
Docker containers have an ephemeral (temporary) filesystem by default therefore any data created inside a container is permanently deleted when the container is removed. There volumes provide the ability to
- Persist data across docker state change such as container restart, removal, etc.
- Sharing data across multiple containers
- More I/O performance as its is more performative to write to docker volumes compared to containers writable layer.
- Simplifies backing up, restoring and moving data between hosts.

Docker has three ways to get data into a container:

| Type | Managed by | Use case |
|---|---|---|
| Named volume | Docker | Persistent data (databases, uploads) |
| Bind mount | You (host path) | Dev-time live source mounting |
| tmpfs mount | Kernel (RAM only) | Ephemeral secrets, never touches disk |

```yaml
volumes:
  - pgdata:/var/lib/postgresql/data   # named volume
  - ./src:/app/src                     # bind mount
  - type: tmpfs                        # tmpfs
    target: /run/secrets
```

# Helpful Commands

**Images**

```sh
docker build -t name:tag .            # build an image from a Dockerfile
docker build --platform linux/amd64 . # build for a specific architecture
docker images                         # list local images
docker image ls temp                  # size of a specific image
docker history <image>                # show each layer and its size
docker rmi <image>                    # remove an image
docker image prune                    # remove dangling (untagged) images
```

**Containers**

```sh
docker run -d -p 3000:3000 myapp      # run detached, publish a port
docker ps                             # list running containers
docker ps -a                          # list all containers, including stopped
docker logs -f <container>            # follow logs
docker exec -it <container> sh        # shell into a running container
docker stop <container>               # SIGTERM, then SIGKILL after 10s
docker rm <container>                 # remove a stopped container
docker inspect <container>            # full container config/state as JSON
```

**Compose**

```sh
docker compose up -d                  # build (if needed) and start the stack
docker compose ps                     # status of services in this project
docker compose logs -f <service>      # follow logs for one service
docker compose exec <service> sh      # shell into a running service
docker compose down                   # stop and remove containers + network
docker compose down -v                # also remove named volumes
docker compose config                 # print the fully resolved config
docker compose up -d --force-recreate # recreate containers even if unchanged
```

**Volumes & Networks**

```sh
docker volume ls / inspect <name>
docker network ls / inspect <name>
docker volume prune                   # remove unused volumes
docker network prune                  # remove unused networks
```

**System**

```sh
docker system df                      # disk usage breakdown
docker system prune -a --volumes      # nuke everything unused (careful)
```

**Debugging tools worth knowing**

```sh
dive <image>                                                    # inspect layer-by-layer size breakdown
docker buildx create --use                                      # create and switch to a buildx builder
docker buildx build --platform linux/amd64,linux/arm64 \
  -t user/myapp:latest --push .                                 # build and push a multi-arch image
```

# References

- [Dockerfile reference](https://docs.docker.com/reference/dockerfile/)
- [Compose file reference](https://docs.docker.com/reference/compose-file/)
- [Docker CLI reference](https://docs.docker.com/reference/cli/docker/)
- [BuildKit cache mounts](https://docs.docker.com/build/cache/optimize/)
- [Docker networking overview](https://docs.docker.com/engine/network/)
- [Docker volumes](https://docs.docker.com/engine/storage/volumes/)
- [OCI Image Spec](https://github.com/opencontainers/image-spec)
- [OCI Runtime Spec](https://github.com/opencontainers/runtime-spec)
- [dive — image layer explorer](https://github.com/wagoodman/dive)
- [tini — a minimal init for containers](https://github.com/krallin/tini)
- [Why I Will Never Use Alpine Linux Ever Again](https://martinheinz.dev/blog/92)

If you have reached till here, thank you! I hope you liked it and if you hated this, thank you! for caring enough to hate. If you get stuck or get any error feel free to message me.
