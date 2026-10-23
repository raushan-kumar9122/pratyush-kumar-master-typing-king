# PRATYUSH KUMAR MASTER PRO
### Official Windows Desktop Typing Tutor & Typing Game Software
**Developed for: The Future Track Computer Education**

---

## 1. Product Overview

**PRATYUSH KUMAR MASTER PRO** is a commercial-grade Windows desktop application built for professional computer institutes, training academies, and competitive examination aspirants. 

### Core Highlights
* **100% Offline-First**: Zero internet connection needed for daily typing practice, tests, games, and student evaluation.
* **Dual Language Mastery**: Full English touch-typing curriculum and Unicode Devanagari Hindi typing (Inscript and Remington Gail layouts).
* **6 Playable Typing Arcade Games**: Falling Words, Type Racer (against 3 AI opponents), Word Blitz, Sentence Sprint, Keyboard Challenge, and Survival Typing.
* **Supervised Examination Mode**: Locked testing durations (50m full session, 10m standard, 5m, 2m), strict Backspace disabling, invigilator verification, and official print-ready ISO 9001:2015 certified marksheet certificates.
* **Ergonomic Virtual Keyboard**: Real-time tactile finger color zones (Pinky, Ring, Middle, Index, Thumb) with live next-key flash guidance.
* **Local Student Management**: Multi-profile student enrollment, individual performance targets, progress charting, and safe database backup & recovery.

---

## 2. Platform & System Requirements

* **Operating System**: Windows 10 (64-bit), Windows 11 (64-bit)
* **Architecture**: x86-64 / AMD64 native
* **Memory**: Minimum 512 MB RAM (Recommended 2 GB)
* **Storage**: 150 MB free disk space
* **Display**: 1024 × 768 minimum resolution (Optimized for 1920 × 1080 Full HD)
* **No Cloud / No External API dependency**: Operates locally without external server requirements.

---

## 3. Official Scoring Formulas

The software implements standard commercial and government certification criteria (e.g., CPCT, SSC, High Court, Railway):

$$\text{Gross WPM} = \frac{\text{Total Characters Typed} / 5}{\text{Elapsed Minutes}}$$

$$\text{Net WPM} = \max\left(0, \text{Gross WPM} - \frac{\text{Penalized Errors}}{\text{Elapsed Minutes}}\right)$$

$$\text{Accuracy \%} = \frac{\text{Correct Evaluated Characters}}{\text{Total Evaluated Characters}} \times 100$$

$$\text{Keystroke Velocity (CPM)} = \frac{\text{Total Characters Typed}}{\text{Elapsed Minutes}}$$

### Certification Grade Scale
* **Grade A+**: $\ge 50$ Net WPM and $\ge 95\%$ Accuracy
* **Grade A**: $\ge 40$ Net WPM and $\ge 90\%$ Accuracy
* **Grade B**: $\ge 30$ Net WPM and $\ge 85\%$ Accuracy
* **Grade C**: $\ge 20$ Net WPM and $\ge 80\%$ Accuracy
* **Grade D**: $\ge 15$ Net WPM
* **Grade F**: $< 15$ Net WPM or $< 75\%$ Accuracy

---

## 4. Hindi Unicode Configuration Guide (Windows 10 / 11)

To practice Hindi typing with Windows IME:
1. Open Windows **Settings** (`Win + I`).
2. Navigate to **Time & Language** ➔ **Language & Region**.
3. Click **Add a language** and select **Hindi (हिंदी)**.
4. Under Hindi options, add **Hindi Traditional (Inscript)** or **Hindi Remington (Gail)** keyboard.
5. In the application, press `Alt + Shift` or `Win + Space` to switch between English and Hindi at any time.

---

## 5. Building & Packaging for Windows

### Development Mode
```bash
npm install
npm run dev
```

### Compile Production Web Build
```bash
npm run build
```

### Windows Desktop Packaging (Electron / NSIS Installer)
To generate the `.exe` Windows installer:
```bash
npm run build
npx electron-builder --win nsis
```
Output files will be generated in `/dist`:
* `PRATYUSH-KUMAR-MASTER-PRO-Setup-3.4.12.exe` (Official NSIS Windows Installer)
* `PRATYUSH-KUMAR-MASTER-PRO-3.4.12-win-x64.zip` (Portable Windows Standalone)

---

## 6. Database Schema & Backup / Restore

All records are stored locally with structured schemas:
* **Students**: `id`, `rollNo`, `name`, `batch`, `course`, `avatar`, `targetWpm`, `targetAccuracy`, `totalPracticeTimeSeconds`
* **TestResults**: `id`, `studentId`, `timestamp`, `language`, `durationSeconds`, `passageTitle`, `grossWpm`, `netWpm`, `accuracy`, `totalCharacters`, `correctCharacters`, `errorCharacters`, `backspaceCount`, `mode`, `grade`, `weakKeys`
* **Achievements**: `id`, `title`, `description`, `icon`, `unlockedAt`, `requirement`
* **Settings**: `theme`, `soundEnabled`, `soundVolume`, `soundTheme`, `backspacePolicy`, `showKeyboard`

### Backup & Restore Procedure:
1. Open **Student Records** or **Settings** tab.
2. Click **Backup DB** to download `FTCE_Full_Database_YYYY-MM-DD.json`.
3. To restore on another computer, click **Restore DB** and select your `.json` backup file.

---

## 7. Institute Certification

* Official certificates can be printed or saved directly as PDF via the **Print Certificate** button.
* Includes Institute Seal, Candidate Verification QR/Serial number, and examiner signature lines.

© 2026 The Future Track Computer Education. All Rights Reserved.
