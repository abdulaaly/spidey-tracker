class SoundManagerService {
  private enabled: boolean = false;
  private volume: number = 0.8;
  private audioCache: Map<string, HTMLAudioElement> = new Map();

  constructor() {
    // Attempt to read sound preference safely
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem('spidey_sound_enabled');
        if (saved !== null) {
          this.enabled = saved === 'true';
        }
      } catch (e) {}
    }
  }

  public setEnabled(enable: boolean) {
    this.enabled = enable;
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('spidey_sound_enabled', String(enable));
      } catch (e) {}
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public playJingle() {
    if (!this.enabled) return;
    this.playSound('/sounds/spidey_jingle.mp3');
  }

  public playSound(src: string) {
    if (!this.enabled) return;
    try {
      let audio = this.audioCache.get(src);
      if (!audio) {
        audio = new Audio(src);
        audio.preload = 'auto';
        this.audioCache.set(src, audio);
      }
      audio.volume = this.volume;
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Autoplay policy handled gracefully
      });
    } catch (e) {
      console.warn('Audio play failed:', e);
    }
  }

  public playCategory(category: string) {
    if (!this.enabled) return;
    // Map categories to appropriate Ned sounds or default jingle
    const nedBites: Record<string, string> = {
      preloader: 'https://flash.sonypictures.com/movies/spidermanbrandnewday/sounds/ned_sound_bites/welcome_to_the_Spidey_Tracker.MP3',
      activity: 'https://flash.sonypictures.com/movies/spidermanbrandnewday/sounds/ned_sound_bites/calling_all_webheads_we\'ve_got_some_fresh_sighting.MP3',
      webwatch: 'https://flash.sonypictures.com/movies/spidermanbrandnewday/sounds/ned_sound_bites/got_some_new_info_on_the_mysterious_presence_check.MP3',
      events: 'https://flash.sonypictures.com/movies/spidermanbrandnewday/sounds/ned_sound_bites/our_first_meet_ups_have_been_posted_in_event_updat.MP3',
      notification: '/sounds/spidey_jingle.mp3',
      general: 'https://flash.sonypictures.com/movies/spidermanbrandnewday/sounds/ned_sound_bites/a_brand_new_day_brand_new_sightings.MP3'
    };

    const targetUrl = nedBites[category] || '/sounds/spidey_jingle.mp3';
    this.playSound(targetUrl);
  }
}

export const soundManager = new SoundManagerService();
