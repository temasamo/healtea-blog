class GoogleTranslateLimiter {
  private dailyCount: number = 0;
  private minuteCount: number = 0;
  private lastResetDate: string = '';
  private lastResetMinute: string = '';

  constructor() {
    this.loadCounts();
  }

  private loadCounts() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('translateLimiter');
      if (saved) {
        const data = JSON.parse(saved);
        this.dailyCount = data.dailyCount || 0;
        this.minuteCount = data.minuteCount || 0;
        this.lastResetDate = data.lastResetDate || '';
        this.lastResetMinute = data.lastResetMinute || '';
      }
    }
  }

  private saveCounts() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('translateLimiter', JSON.stringify({
        dailyCount: this.dailyCount,
        minuteCount: this.minuteCount,
        lastResetDate: this.lastResetDate,
        lastResetMinute: this.lastResetMinute
      }));
    }
  }

  private resetDailyCount() {
    const today = new Date().toDateString();
    if (this.lastResetDate !== today) {
      this.dailyCount = 0;
      this.lastResetDate = today;
      this.saveCounts();
    }
  }

  private resetMinuteCount() {
    const currentMinute = new Date().toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
    if (this.lastResetMinute !== currentMinute) {
      this.minuteCount = 0;
      this.lastResetMinute = currentMinute;
      this.saveCounts();
    }
  }

  canTranslate(): boolean {
    this.resetDailyCount();
    this.resetMinuteCount();

    const maxDaily = parseInt(process.env.NEXT_PUBLIC_MAX_TRANSLATIONS_PER_DAY || '100');
    const maxMinute = parseInt(process.env.NEXT_PUBLIC_MAX_TRANSLATIONS_PER_MINUTE || '3');

    return this.dailyCount < maxDaily && this.minuteCount < maxMinute;
  }

  incrementCount() {
    this.dailyCount++;
    this.minuteCount++;
    this.saveCounts();
  }

  getRemainingDaily(): number {
    const maxDaily = parseInt(process.env.NEXT_PUBLIC_MAX_TRANSLATIONS_PER_DAY || '100');
    return Math.max(0, maxDaily - this.dailyCount);
  }

  getRemainingMinute(): number {
    const maxMinute = parseInt(process.env.NEXT_PUBLIC_MAX_TRANSLATIONS_PER_MINUTE || '3');
    return Math.max(0, maxMinute - this.minuteCount);
  }
}

export const translateLimiter = new GoogleTranslateLimiter(); 