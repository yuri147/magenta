import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { Visualizer } from '@magenta/music';
// const magenta = require('@magenta/music');
// const core = require('@magenta/music/node/core');
declare global {
  interface Window {
    mm: any;
    core: any;
    music_vae: any;
    Tone: any;
    Note: any;
  }
}

@Component({
  selector: 'app-magenta',
  templateUrl: './magenta.component.html',
  styleUrls: ['./magenta.component.scss']
})
export class MagentaComponent implements OnInit {
  improvRNN: any;
  sequence: any;
  // synth = new window.Tone.Synth().toMaster();

  @ViewChild('showMidi', { static: true }) showMidi: ElementRef<HTMLCanvasElement>;
  constructor() {}

  playOriginalMelody() {
    // this.sequence.notes.forEach(note => {
    //   this.synth.triggerAttackRelease(window.Note.fromMidi(note.pitch), note.endTime - note.startTime, note.startTime);
    // });
  }

  async play() {
    // Instantiate model by loading desired config.

    const quantizedSequence = window.mm.sequences.quantizeNoteSequence(this.sequence, 1);
    try {
      await this.improvRNN.initialize();
      const improvisedMelody = await this.improvRNN.continueSequence(quantizedSequence, 60, 1.1, [
        'Bm',
        'Bbm',
        'Gb7',
        'F7',
        'Ab',
        'Ab7',
        'G7',
        'Gb7',
        'F7',
        'Bb7',
        'Eb7',
        'AM7'
      ]);
      // const improvisedMelody = await this.improvRNN.continueSequence(quantizedSequence, 20, 1.5);
      const viz = new window.mm.Visualizer(improvisedMelody, this.showMidi.nativeElement, {
        noteHeight: 6,
        pixelsPerTimeStep: 30, // like a note width
        noteSpacing: 1,
        noteRGB: '8, 41, 64',
        activeNoteRGB: '240, 84, 119'
      });
      let i = 0;
      const rnnPlayer = new window.mm.Player(false, {
        run: note => {
          console.info(viz);
          const ctx = this.showMidi.nativeElement.getContext('2d');
          viz.ctx = this.showMidi.nativeElement.getContext('2d');
          viz.redraw(note);
          i++;
          ctx.fillRect(0, i, 5, 5);
        },
        stop: () => {
          console.info('done');
        }
      });
      rnnPlayer.start(improvisedMelody);
    } catch (error) {
      console.error(error);
    }
  }

  async ngOnInit() {
    const improvCheckpoint = 'https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/chord_pitches_improv';
    this.improvRNN = await new window.mm.MusicRNN(improvCheckpoint);
    // this.sequence = {
    //   ticksPerQuarter: 220,
    //   totalTime: 28.5,
    //   timeSignatures: [
    //     {
    //       time: 0,
    //       numerator: 4,
    //       denominator: 4
    //     }
    //   ],
    //   tempos: [
    //     {
    //       time: 0,
    //       qpm: 120
    //     }
    //   ],
    //   notes: [
    //     { pitch: 'Gb3', startTime: 0, endTime: 1 },
    //     { pitch: 'F4', startTime: 1, endTime: 3.5 },
    //     { pitch: 'Ab4', startTime: 3.5, endTime: 4 },
    //     { pitch: 'C5', startTime: 4, endTime: 4.5 },
    //     { pitch: 'Eb5', startTime: 4.5, endTime: 5 },
    //     { pitch: 'Gb5', startTime: 5, endTime: 6 },
    //     { pitch: 'F5', startTime: 6, endTime: 7 },
    //     { pitch: 'E5', startTime: 7, endTime: 8 },
    //     { pitch: 'Eb5', startTime: 8, endTime: 8.5 },
    //     { pitch: 'C5', startTime: 8.5, endTime: 9 },
    //     { pitch: 'G4', startTime: 9, endTime: 11.5 },
    //     { pitch: 'F4', startTime: 11.5, endTime: 12 },
    //     { pitch: 'Ab4', startTime: 12, endTime: 12.5 },
    //     { pitch: 'C5', startTime: 12.5, endTime: 13 },
    //     { pitch: 'Eb5', startTime: 13, endTime: 14 },
    //     { pitch: 'D5', startTime: 14, endTime: 15 },
    //     { pitch: 'Db5', startTime: 15, endTime: 16 },
    //     { pitch: 'C5', startTime: 16, endTime: 16.5 },
    //     { pitch: 'F5', startTime: 16.5, endTime: 17 },
    //     { pitch: 'F4', startTime: 17, endTime: 19.5 },
    //     { pitch: 'G4', startTime: 19.5, endTime: 20 },
    //     { pitch: 'Ab4', startTime: 20, endTime: 20.5 },
    //     { pitch: 'C5', startTime: 20.5, endTime: 21 },
    //     { pitch: 'Eb5', startTime: 21, endTime: 21.5 },
    //     { pitch: 'C5', startTime: 21.5, endTime: 22 },
    //     { pitch: 'Eb5', startTime: 22, endTime: 22.5 },
    //     { pitch: 'C5', startTime: 22.5, endTime: 24.5 },
    //     { pitch: 'Eb5', startTime: 24.5, endTime: 25.5 },
    //     { pitch: 'G4', startTime: 25.5, endTime: 28.5 }
    //   ]
    // };
    this.sequence = {
      notes: [
        { pitch: 60, startTime: 0.0, endTime: 0.5 },
        { pitch: 60, startTime: 0.5, endTime: 1.0 },
        { pitch: 67, startTime: 1.0, endTime: 1.5 },
        { pitch: 67, startTime: 1.5, endTime: 2.0 },
        { pitch: 69, startTime: 2.0, endTime: 2.5 },
        { pitch: 69, startTime: 2.5, endTime: 3.0 },
        { pitch: 67, startTime: 3.0, endTime: 4.0 },
        { pitch: 65, startTime: 4.0, endTime: 4.5 },
        { pitch: 65, startTime: 4.5, endTime: 5.0 },
        { pitch: 64, startTime: 5.0, endTime: 5.5 },
        { pitch: 64, startTime: 5.5, endTime: 6.0 },
        { pitch: 62, startTime: 6.0, endTime: 6.5 },
        { pitch: 62, startTime: 6.5, endTime: 7.0 },
        { pitch: 60, startTime: 7.0, endTime: 8.0 }
      ],
      tempos: [
        {
          time: 0,
          qpm: 120
        }
      ],
      totalTime: 8
    };
  }
}
