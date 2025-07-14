# Developer Certificate of Origin

## Version 1.1

Copyright (C) 2004, 2006 The Linux Foundation and its contributors.
1 Letterman Drive
Suite D4700
San Francisco, CA, 94129, USA

Everyone is permitted to copy and distribute verbatim copies of this
license document, but changing it is not allowed.

## Developer's Certificate of Origin 1.1

By making a contribution to this project, I certify that:

(a) The contribution was created in whole or in part by me and I
have the right to submit it under the open source license
indicated in the file; or

(b) The contribution is based upon previous work that, to the best
of my knowledge, is covered under an appropriate open source
license and I have the right under that license to submit that
work with modifications, whether created in whole or in part
by me, under the same open source license (unless I am
permitted to submit under a different license), as indicated
in the file; or

(c) The contribution was provided directly to me by some other
person who certified (a), (b) or (c) and I have not modified
it.

(d) I understand and agree that this project and the contribution
are public and that a record of the contribution (including all
personal information I submit with it, including my sign-off) is
maintained indefinitely and may be redistributed consistent with
this project or the open source license(s) involved.

## How to Sign Your Commits

To sign your commits, add the following line to your commit message:

```
Signed-off-by: Your Name <your.email@example.com>
```

You can add this line automatically by using the `-s` flag when committing:

```bash
git commit -s -m "Your commit message"
```

Or you can add it manually to your commit message:

```
Your commit message

Signed-off-by: Your Name <your.email@example.com>
```

## Multiple Sign-offs

If you are submitting work that includes contributions from multiple people, each person should add their own sign-off line:

```
Signed-off-by: Alice <alice@example.com>
Signed-off-by: Bob <bob@example.com>
```

## Verification

The DCO check will verify that all commits in your pull request are signed off. If any commits are missing the sign-off, the check will fail and you'll need to add the sign-off to those commits.

## Questions?

If you have questions about the DCO, please contact the project maintainers or refer to the [DCO FAQ](https://developercertificate.org/).
