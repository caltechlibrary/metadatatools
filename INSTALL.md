# Installation

This project is experiment and yet to reach the working proof of concept stage.
There is only a mimimal installation process beyond cloning this repository and
building from source.

## Quick install with curl or irm

There is an experimental installer.sh script that can be run with the following
command to install latest table release. This may work for macOS, Linux and if
you’re using Windows with the Unix subsystem. This would be run from your shell
(e.g. Terminal on macOS).

curl https://caltechlibrary.github.io/metadatatools/installer.sh | sh

This will install dataset and datasetd in your $HOME/bin directory.

If you are running Windows 10 or 11 (x86_64 only) use the Powershell command
below.

irm https://caltechlibrary.github.io/metadatatools/installer.ps1 | iex

NOTE: If you want to install on ARM64 Windows, follow the build and install from
source instructions below.

If your want to install a specific verions set the PKG_VERSION environment
variable then download. E.g. version 0.0.1 in tihs example.

For Linux and macOS

export PKG_VERSION=0.0.1 curl
https://caltechlibrary.github.io/metadatatools/installer.sh | sh

For Windows

$env:PKG_VERSION = '0.0.1' irm
https://caltechlibrary.github.io/metadatatools/installer.ps1 | iex

## Build and install from source

### Software Requiremets for building from source

- Deno >= 2.1.3
- Pandoc >= 3.1.12
- GNU Make >= 3.81

### Steps

1. Clone the GitHub repository
2. change into the metadatatools directory
3. Run `make`
4. Run `make test`
5. Run `make install`

```
git clone https://github.com/caltechlibrary/metadatatools
cd metadatatools
make
make test
make install
```

On Windows 10 or 11 on ARM you can either use the Linux Subsystem for Windows or
Powershell. If you are using Powershell then you will not be able to use the
Makefile since it assumes a POSIX system. Instead you can biuld using
`deno task build` command. This will generate a `mtd.exe` in the bin folder. You
can move the exe file to an appropriate place in your path.
