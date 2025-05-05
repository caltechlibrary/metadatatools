Installation for development of **metadatatools**
===========================================

**metadatatools** Inspired by the Python IdUtils package metadatatools provides similar functionality in TypeScript.

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

Installing from source
----------------------

### Required software

- Deno &gt;&#x3D; 2.3
- Pandoc &gt;&#x3D; 3.1
- GNU Make &gt;&#x3D; 3.81
- CMTools &gt;&#x3D; 0.0.25

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

