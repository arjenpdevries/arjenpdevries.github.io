---
layout: "post"
title: "Patching the kernel on Fedora"
author: "Arjen P. de Vries"
date: "2021-02-26 12:00"
excerpt: "Fedora Core has a handy kernel build system that is not that well documented..."
tags: linux
---

My desktop has run Fedora Core ever since I joined
[CWI](https://www.cwi.nl/) in 1999 (and I remember being excited that
a _real_ institute ran all its desktops on Linux!).

Things usually run perfectly fine, aside the occasional struggle with
SELinux, GNOME and Wayland to make those do what I want. Not that long
after my update to Fedora Core 33 (FC33), but not right away, the
graphical drivers started to misbehave. Luckily, I was not the first
to encounter this problem, and after a few searches I discovered that
the Red Hat team had already been working toward a solution for [`[Bug
1925346]`][bugzilla] _(Screen glitches after updating to Kernel 5.10.10)_.

Red Hat's Hans de Goede has created `koji` kernels as a workaround,
that seem to resolve the problem, but these do not go well together
with UEFI BIOSes (those are unsigned). Kindly, Hans has
[shared a patch](https://bugzilla.redhat.com/show_bug.cgi?id=1925346#c33), 
so off we go! Back to the times predating Red Hat and Ubuntu, when we
had to build our own kernels on a regular basis...

_Note: You do not have to compile a kernel any longer, since the proposed 
update is already available in the
[Red Hat testing](https://bodhi.fedoraproject.org/updates/FEDORA-2021-79396b21b2)
repo._

## Preparations

Fedora Core has a handy kernel build system that is however not
that well documented (although there is [some info on the
wiki][fedkerneldoc]).

Depending on the size of the partition that contains your home
directory, it may be wise to select a location on a different disk for
the intermediate files that are created during the building process:

	MYRPMROOT=/export/data1/arjen/rpmbuild
	
Move the package repository to this new location:

	mkdir -p ${MYRPMROOT}
	cd ${MYRPMROOT}
	mkdir -p BUILD RPMS RPMS/i386 SOURCES SPECS SRPMS

    echo %_topdir ${MYRPMROOT} >> ${HOME}/.rpmmacros

Clone the kernel tree and switch to the FC33 release branch:

    fedpkg clone -a kernel
    cd kernel
    fedpkg switch-branch f33

## Configuration

In `kernel.spec` set `buildid` to `.i915p` (or whatever you like);
and set the signing certificate (creating your own kernel siging
certificates is a nice topic for a companion post...).

    %define buildid .i915p
	%define pe_signing_cert {Tiqre BV}

Configure the kernel (modules) by modifying the `kernel-local` file,
that will be picked up when you build; see also the [`kconfig.txt`
documentation][kconfig].

```
cat >> kernel-local <<__EOF__
CONFIG_IKCONFIG=y
CONFIG_IKCONFIG_PROC=y
__EOF__
```

The options I chose here ensure that the kernel config file ends up in
`/proc/config.gz`. 
An alternative approach would be to directly copy (and then edit) an
existing kernel config file to `.config`:

    cp kernel-x86_64-fedora.config .config

## Add patches

Download the patch file provided and copy it into the kernel
directory:

    cp ~/Downloads/i915-fixes.patch .

Add the patch name to `kernel.spec`, at the bottom of the list of
patches that should be applied (right above `# END OF PATCH
DEFINITIONS`):

    Patch9001: i915-fixes.patch

When building the kernel below, the logs include the results of
applying the three individual patches to the Intel drivers that make
up the `i915-fixes` patch:

```
Applying: drm/i915/gt: One more flush for Baytrail clear residuals
Applying: drm/i915/gt: Flush before changing register state
Applying: drm/i915/gt: Correct surface base address for renderclear
```

## Build the kernel

Install kernel-specific dependencies and build a new kernel (assuming
that you do not need the _debug_ versions of kernel and modules):

    sudo dnf builddep kernel.spec
	make release

I think you can safely ignore the `error: %changelog not in descending
chronological order` (seems to be a known problem with timezones in
the `rpm` version that ships with FC33).

You can now build a complete kernel release with `fedpkg local` but I
prefer the _fast track_ approach that creates less packages, by for
example not including the debug ones in the build:

    fedpkg srpm
    export MYKERNELVERSION=kernel-5.10.17-206.i915p
    ./scripts/fast-build.sh x86_64 ${MYKERNELVERSION}.fc33.src.rpm
	
_Adapt the kernel version environment variable according to output!_

Now, go make yourself a large cup of coffee, because no matter how
powerful machines have become, building a kernel takes considerable
time.

## Install the kernel

Upon successful completion of the build, the new packages are created
in the `RPMS` directory we created at the start. Install the files
using `dnf`:

    sudo dnf install $MYRPMROOT/RPMS/x86_64/*${MYKERNELVERSION}*

After rebooting, `uname -sr` shows the (expected) `Linux
5.10.17-206.i915p.fc33.x86_64`, and, _no more problems with the Intel
video card_.

## Acknowledgement

Hans de Goede has been so kind to share the composite patch that
contains the exact three modifications on the Intel driver that we
need. Also, I would never have understood the Fedora kernel
compilation process without this [very helpful
post](https://forum.level1techs.com/t/compile-fedora-kernel-the-fedora-way/149242).

[bugzilla]:		https://bugzilla.redhat.com/show_bug.cgi?id=1925346			"Bugzilla report on driver problems"
[fedkerneldoc]:	https://fedoraproject.org/wiki/Building_a_custom_kernel		"Fedora docs"
[kconfig]:		https://www.kernel.org/doc/Documentation/kbuild/kconfig.txt	"kconfig.txt"
