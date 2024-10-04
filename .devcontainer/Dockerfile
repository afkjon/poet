FROM ubuntu:latest

# ==========================
# Setup building the rest of this image...
# ==========================
RUN yes | unminimize
RUN apt update
RUN apt install -y curl
RUN apt install -y gnupg
RUN apt install -y build-essential
RUN apt install -y ca-certificates 
RUN apt install -y wget
RUN apt install -y unzip
RUN apt install -y git
RUN apt install -y gh
RUN apt install -y vim
RUN apt install -y sudo
RUN apt install -y telnet

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip
RUN ./aws/install

RUN apt install -y zsh
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# ==========================
# Update package sources...
# ==========================
RUN install -m 0755 -d /etc/apt/keyrings
RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
RUN chmod a+r /etc/apt/keyrings/docker.gpg
RUN echo \
    "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
    tee /etc/apt/sources.list.d/docker.list > /dev/null

RUN curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.28/deb/Release.key | gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
RUN echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.28/deb/ /' | tee /etc/apt/sources.list.d/kubernetes.list
RUN install -m 0755 -d /etc/apt/keyrings

RUN apt update

# ==========================
# Install packages required to compile items...
# ==========================
RUN apt install -y libc6
RUN apt install -y git
RUN apt install -y musl-tools
RUN apt install -y kubectl
RUN apt install -y libssl-dev
RUN apt install -y vim
# Install Docker
RUN apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin
# Install envsubst
RUN apt install -y gettext-base
# Install doctl
RUN wget https://github.com/digitalocean/doctl/releases/download/v1.98.1/doctl-1.98.1-linux-amd64.tar.gz
RUN tar xf doctl-1.98.1-linux-amd64.tar.gz
RUN mv doctl /usr/local/bin
# Install Bazel
RUN wget https://github.com/bazelbuild/bazelisk/releases/download/v1.19.0/bazelisk-linux-amd64 -O /usr/local/bin/bazel
RUN chmod +x /usr/local/bin/bazel
# Install xdg-utils
RUN apt install -y xdg-utils
# Install protobuf compiler
RUN apt install -y protobuf-compiler

# ==========================
# Install additional dev tools...
# ==========================
# Install teleport
RUN curl https://goteleport.com/static/install.sh | bash -s 15.4.7

# Install telepresence
RUN curl -fL https://app.getambassador.io/download/tel2oss/releases/download/v2.17.0/telepresence-linux-amd64 -o /usr/local/bin/telepresence
RUN chmod a+x /usr/local/bin/telepresence

# Install vlt CLI
RUN apt-get update && apt-get install gpg coreutils
RUN curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
RUN echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com jammy main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
RUN apt update && apt install hcp -y

# ==========================
# Install python tools
# ==========================
# Install Django
RUN python -m pip install Django==5.1.1

# ==========================
# Setup a non-root execution user...
# ==========================
ARG USERNAME=guardian
ARG USER_UID=2000
ARG USER_GID=$USER_UID

RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
    && apt-get update \
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

USER $USERNAME
