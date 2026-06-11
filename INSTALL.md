Installation **metadatatools**
============================

**metadatatools** Inspired by the Python IdUtils package metadatatools provides similar functionality in TypeScript and Go.

Quick install with curl or irm
------------------------------

There is an experimental installer.sh script that can be run with the following command to install latest table release. This may work for macOS, Linux and if you’re using Windows with the Unix subsystem. This would be run from your shell (e.g. Terminal on macOS).

~~~shell
curl https://caltechlibrary.github.io/metadatatools/installer.sh | sh
~~~

This will install the programs included in metadatatools in your `$HOME/bin` directory.

If you are running Windows 10 or 11 use the Powershell command below.

~~~ps1
irm https://caltechlibrary.github.io/metadatatools/installer.ps1 | iex
~~~

### If your are running macOS or Windows

You may get security warnings if you are using macOS or Windows. See the notes for the specific operating system you’re using to fix issues.

- [INSTALL_NOTES_macOS.md](INSTALL_NOTES_macOS.md)
- [INSTALL_NOTES_Windows.md](INSTALL_NOTES_Windows.md)

Installing from source
----------------------

### Required software

- Deno >= 2.3
- Go >= 1.26

### Steps

1. git clone https://github.com/caltechlibrary/metadatatools
2. Change directory into the `metadatatools` directory
3. Make to build, test and install

~~~shell
git clone https://github.com/caltechlibrary/metadatatools
cd metadatatools
make
make test
make install
~~~

