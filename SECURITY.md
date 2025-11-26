# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of Team X-Ray seriously. If you discover a security vulnerability, please follow these steps:

### 📧 How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via one of the following methods:

1. **GitHub Security Advisories** (Preferred)
   - Navigate to the [Security tab](https://github.com/AndreaGriffiths11/teamxray/security/advisories/new)
   - Click "Report a vulnerability"
   - Provide detailed information about the vulnerability

2. **Email**
   - Send details to: **andrea@mainbranch.dev**
   - Use the subject line: `[SECURITY] Team X-Ray Vulnerability Report`

### 📝 What to Include

Please include the following information in your report:

- **Type of vulnerability** (e.g., XSS, CSRF, SQL injection, token exposure)
- **Full path(s) of source file(s)** related to the vulnerability
- **Step-by-step instructions** to reproduce the issue
- **Proof-of-concept or exploit code** (if possible)
- **Impact of the vulnerability** - what can an attacker accomplish?
- **Suggested fix** (if you have one)

### ⏱️ Response Timeline

- **Initial Response**: Within 48 hours of report submission
- **Status Update**: Within 7 days with validation and severity assessment
- **Resolution Timeline**: Varies based on severity
  - **Critical**: Within 7 days
  - **High**: Within 30 days
  - **Medium**: Within 90 days
  - **Low**: Best effort

### 🔒 Disclosure Policy

- Security vulnerabilities will be disclosed responsibly
- We will coordinate with you on the disclosure timeline
- Public disclosure will only occur after a fix is available
- We will credit reporters in security advisories (unless you prefer anonymity)

## Security Best Practices for Users

### Token Management

- **Never commit tokens** to version control
- Store tokens securely using VS Code's secret storage
- Use tokens with **minimal required permissions**:
  - `repo` (for private repositories)
  - `read:user` (for user information)
  - `read:org` (for organization analysis)
- Rotate tokens regularly (every 90 days recommended)
- Revoke tokens immediately if compromised

### Extension Configuration

- Keep the extension updated to the latest version
- Review the extension's permissions before installation
- Only install from official VS Code Marketplace
- Report suspicious behavior immediately

### GitHub Token Scopes

Minimum required scopes for Team X-Ray:
```
repo (if analyzing private repositories)
read:user
read:org (for organization analysis)
```

Avoid granting unnecessary permissions like:
- `admin:*`
- `delete_repo`
- `workflow` (unless explicitly needed)

## Known Security Considerations

### Current Implementation

1. **Token Storage**: Tokens are stored using VS Code's `SecretStorage` API (encrypted)
2. **API Communication**: All GitHub API calls use HTTPS
3. **No External Services**: Extension runs locally, no data sent to third parties
4. **Input Validation**: Repository URLs and user inputs are validated
5. **Content Security Policy**: Webviews use strict CSP

### Dependencies

- We regularly audit dependencies using `npm audit`
- Automated security updates via Dependabot (planned)
- Critical vulnerabilities are patched within 7 days

## Security Updates

Security updates will be released as:
- **Patch versions** (e.g., 1.0.5 → 1.0.6) for minor security fixes
- **Minor versions** (e.g., 1.0.x → 1.1.0) for moderate security improvements
- **Major versions** (e.g., 1.x → 2.0) for significant security architecture changes

## Contact

For security-related questions or concerns:
- **Security Email**: andrea@mainbranch.dev
- **GitHub Security Advisories**: https://github.com/AndreaGriffiths11/teamxray/security
- **General Issues**: https://github.com/AndreaGriffiths11/teamxray/issues
- **Maintainer**: @AndreaGriffiths11

## Acknowledgments

We appreciate the security research community and responsible disclosure. Contributors who report valid security issues will be acknowledged in:
- Security advisories
- Release notes
- This SECURITY.md file (with permission)

Thank you for helping keep Team X-Ray and its users safe! 🛡️
