---
title: Printing Using Epson L380 on linux
description: CUPS print queue for an Epson L380 Series inkjet on Fedora 44
author: quantinium
date: '2026-08-26'
categories:
  - printing
  - cups
published: true
cover_image:
---
## SYNOPSIS

```sh
$ lp -d EPSON_L380 [-o PageSize=size] [-o MediaType=type]
                 [-o StpQuality=level] [-o Resolution=res]
                 [-o StpImageType=type] [-o StpColorCorrection=mode]
                 [-o StpFullBleed=True] file
```

## DESCRIPTION

Documents the setup of an Epson L380 Series printer on Fedora 44, where no
model-exact driver is available from any repository. The queue uses
Gutenprint's Epson L310 driver as a substitute, which was verified working
end to end.

The L380 is USB-only i.e. it has no network interface and no Wi-Fi (the L385 is
the wireless variant of the same generation). Driverless IPP, AirPrint, and
IPP-over-USB are therefore all unavailable. A real driver is mandatory.

## HARDWARE

| Property | Value |
|---|---|
| Model | Epson L380 Series |
| USB ID | `04b8:1120` (Seiko Epson Corp.) |
| Serial | `583251353036313557` |
| Kernel node | `/dev/usb/lp0` |
| Ink system | 4-tank CMYK |

Device URI as discovered by the CUPS USB backend:

```
usb://EPSON/L380%20Series?serial=583251353036313557&interface=1
```

The URI includes the serial, so the queue binds to this specific unit and
survives replugging without grabbing a different USB printer.

## DRIVER SELECTION

No exact driver exists for this model on Fedora 44. Three facts drove the
choice:

1. **`epson-inkjet-printer-escpr` is gone from Fedora.** `dnf search escpr
   epson` returns no matches. Fedora retired this class of package in favour
   of PAPPL printer applications; `pappl-retrofit` and `legacy-printer-app`
   are the replacements, and the latter exists specifically for "classic
   printer drivers which are not part of official Linux repositories".

2. **Gutenprint 5.3.5 has no L380.** Its complete Epson L-series list is
   `escp2-l120`, `escp2-l130`, `escp2-l210`, `escp2-l310`, `escp2-l1300`,
   `escp2-l1800`. Nothing under `/usr/share/gutenprint` or
   `/usr/share/cups` mentions the L380.

3. **The L310 is the same ESC/P-R generation.** Its driver was selected as
   the nearest sibling and confirmed to render output the L380 accepts.

## SETUP

Creating the queue requires root. Performed once:

```sh
$ sudo lpadmin -p EPSON_L380 \
     -v 'usb://EPSON/L380%20Series?serial=583251353036313557&interface=1' \
     -m 'gutenprint.5.3://escp2-l310/expert' \
     -E
$ sudo lpadmin -d EPSON_L380
```

`-E` placed **after** `-p` enables the queue and sets it to accept jobs;
placed before, it would instead request encryption. `-d` makes the queue the
system default.

`lpadmin` prints `Printer drivers are deprecated and will stop working in a
future version of CUPS.` This is expected — see **CAVEATS**.

Verify:

```sh
$ lpstat -p -d          # queue state and default destination
$ lpstat -t             # full status including device URI
```

## OPTIONS

Queue defaults are poor for photo work and for anyone outside the US. The
values below are what the installed PPD actually offers; `lpoptions -p
EPSON_L380 -l` lists all of them.

| Option | Default | Best-quality value | Notes |
|---|---|---|---|
| `PageSize` | `Letter` | `A4` | Default clips or mis-scales A4 documents |
| `MediaType` | `Plain` | match the paper | Largest single quality lever |
| `StpQuality` | `Standard` | `Best` | Scale: `Economy` `Draft` `Standard` `High` `Photo` `HighPhoto` `UltraPhoto` `Best` |
| `Resolution` | `361x360dpi` | `1440x720dpi` | A 4x increase |
| `StpImageType` | `TextGraphics` | `Photo` | Default favours edge sharpness over tonal smoothness |
| `StpColorCorrection` | `None` | `Accurate` | Default applies no correction at all |
| `StpFullBleed` | `False` | `True` | Borderless; supported sizes only |
| `ColorModel` | `RGB` | leave as `RGB` | See **CAVEATS** |

### MediaType values

| Value | Paper |
|---|---|
| `Plain` | Ordinary paper |
| `GlossyPhoto` | Epson **Premium** Glossy Photo Paper |
| `GlossyPaper` | Generic / basic glossy photo paper |
| `Semigloss` | Premium Semigloss |
| `Luster` | Premium Luster |
| `GlossyFilm` | Photo Quality Glossy Film |
| `Matte`, `MatteHeavy` | Matte stock |

Each value carries a distinct ink-density and drying profile. Printing with
`Plain` settings on glossy stock gives flat, under-saturated output.

## EXAMPLES

Best quality on plain A4:

```sh
$ lp -d EPSON_L380 -o PageSize=A4 -o MediaType=Plain \
   -o StpQuality=Best -o Resolution=1440x720dpi \
   -o StpImageType=Photo -o StpColorCorrection=Accurate file.pdf
```

Best quality on glossy photo paper:

```sh
$ lp -d EPSON_L380 -o PageSize=A4 -o MediaType=GlossyPhoto \
   -o StpQuality=Best -o Resolution=1440x720dpi \
   -o StpImageType=Photo -o StpColorCorrection=Accurate file.pdf
```

Borderless 4x6 photo:

```sh
$ lp -d EPSON_L380 -o PageSize=w288h432 -o MediaType=GlossyPhoto \
   -o StpQuality=Best -o Resolution=1440x720dpi \
   -o StpImageType=Photo -o StpFullBleed=True photo.jpg
```

Persist defaults per-user, no root needed (writes `~/.cups/lpoptions`):

```sh
$ lpoptions -p EPSON_L380 -o PageSize=A4 -o MediaType=Plain
```

Print the built-in CUPS test page:

```sh
$ lp -d EPSON_L380 /usr/share/cups/data/testprint
```

## FILES

| Path | Purpose |
|---|---|
| `/etc/cups/printers.conf` | Queue definition (root) |
| `/etc/cups/ppd/EPSON_L380.ppd` | Generated PPD |
| `~/.cups/lpoptions` | Per-user option defaults |
| `/var/log/cups/error_log` | CUPS errors (root) |
| `/dev/usb/lp0` | Kernel USB printer node |
| `/usr/share/cups/data/testprint` | CUPS test page |

## TROUBLESHOOTING

Check the queue drains and the job completes:

```sh
$ lpstat -p EPSON_L380          # idle / printing, with page progress
$ lpstat -o EPSON_L380          # pending jobs; empty means drained
$ lpstat -W completed -o EPSON_L380
$ journalctl -u cups --since '-5 min'
```

Confirm the hardware is still seen:

```sh
$ lsusb | grep -i epson
$ lpinfo -v | grep -i usb
$ ls -l /dev/usb/lp0
```

Re-enable a queue stopped by an error:

```sh
$ sudo cupsenable EPSON_L380
$ sudo cupsaccept EPSON_L380
```

**If output is garbled or colours are wrong**, the L310 substitution is at
fault rather than the configuration. Fall back to Epson's official ESC/P-R
driver, downloaded from Epson's Linux support site as an RPM. It is
self-contained and a CUPS filter plus model-exact PPDs and installs on
Fedora 44 despite not being packaged, because CUPS 2.4.19 still supports
PPDs.

Maintenance commands the queue advertises:

```sh
$ lp -d EPSON_L380 -o printer-command=Clean
$ lp -d EPSON_L380 -o printer-command=PrintSelfTestPage
```

## CAVEATS

**PPD deprecation is a real deadline.** This queue is PPD-based and CUPS 3.0
removes PPD support entirely. When Fedora ships CUPS 3.0, migrate via
`legacy-printer-app` (already available in the `updates` repo). Nothing to
do until then.

**Do not set `ColorModel=CMYK`.** The L380 is a 4-tank CMYK unit, so `CMYK`
looks like the correct choice, but it bypasses Gutenprint's own colour
separation and generally produces worse colour than the `RGB` default.

**Ignore `1441x720dpi` through `1444x720dpi`.** These are Gutenprint
softweave variants, not higher resolutions. `1440x720dpi` is the true
maximum.

**Best quality is slow.** The test page took roughly 80 seconds at
`361x360dpi` / `Standard`. Expect several minutes per page at
`1440x720dpi` / `Best`, with substantially higher ink use.

**Glossy handling.** Feed one sheet at a time — the friction feeder pulls
doubles on glossy stock. Allow a minute or two of drying before touching a
print, as the heavy ink load at `Best` stays wet noticeably longer than on
plain paper.

## ENVIRONMENT

| Component | Version |
|---|---|
| Fedora | 44 |
| CUPS | 2.4.19 |
| Gutenprint | 5.3.5 |
| Driver | `gutenprint.5.3://escp2-l310/expert` |

## SEE ALSO

`lp`(1), `lpadmin`(8), `lpoptions`(1), `lpstat`(1), `lpinfo`(8),
`cupsenable`(8), `cupsaccept`(8), `cups`(1)

Gutenprint: <https://gimp-print.sourceforge.io/>
pappl-retrofit: <https://github.com/OpenPrinting/pappl-retrofit>
