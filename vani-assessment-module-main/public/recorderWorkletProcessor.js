// Enhanced AudioWorklet Processor with better audio handling and debugging
class RecorderWorkletProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.isActive = true;
    this.sampleCount = 0;
    this.processCount = 0;
    this.silentCount = 0;
    this.maxAmplitude = 0;
    this.totalAmplitude = 0;
    
    // Audio quality monitoring
    this.lastStatsReport = 0;
    this.statsInterval = 5000; // Report every 5 seconds
    
    // Buffer for smoothing audio data
    this.smoothingBuffer = new Float32Array(128);
    this.bufferIndex = 0;
    
    console.log('🎵 RecorderWorkletProcessor initialized with enhanced monitoring');
    
    // Listen for commands from main thread
    this.port.onmessage = (event) => {
      const { command, data } = event.data;
      
      switch (command) {
        case 'stop':
          this.isActive = false;
          console.log('🛑 Worklet processor stopped by command');
          break;
        case 'getStats':
          this.sendStats();
          break;
        default:
          console.log('Unknown worklet command:', command);
      }
    };
  }

  process(inputs, outputs, parameters) {
    // Return false if processor should be destroyed
    if (!this.isActive) {
      console.log('🛑 Worklet processor inactive, shutting down');
      return false;
    }

    this.processCount++;
    
    try {
      const input = inputs[0];
      
      // Check if we have valid input
      if (!input || !input[0] || input[0].length === 0) {
        // Log occasionally to avoid spam
        if (this.processCount % 1000 === 0) {
          console.warn('⚠️ No audio input data available');
        }
        return true;
      }

      const inputChannel = input[0];
      const frameCount = inputChannel.length;
      
      // Create a working copy of the audio data
      const audioData = new Float32Array(frameCount);
      let hasValidAudio = false;
      let maxAmp = 0;
      let totalAmp = 0;
      let validSamples = 0;

      // Process each sample with validation and noise gate
      for (let i = 0; i < frameCount; i++) {
        let sample = inputChannel[i];
        
        // Validate sample
        if (!isFinite(sample) || isNaN(sample)) {
          sample = 0; // Replace invalid samples with silence
        } else {
          // Apply simple noise gate (adjust threshold as needed) 
            hasValidAudio = true;
            validSamples++;
            totalAmp += Math.abs(sample);
            maxAmp = Math.max(maxAmp, Math.abs(sample));
        }
        
        audioData[i] = sample;
      }

      // Update running statistics
      this.sampleCount += frameCount;
      this.totalAmplitude += totalAmp;
      this.maxAmplitude = Math.max(this.maxAmplitude, maxAmp);
      
      if (!hasValidAudio) {
        this.silentCount++;
      }


      try {
        // Send the processed audio data to main thread
        this.port.postMessage(audioData);
      } catch (postError) {
        console.error('❌ Failed to post audio data:', postError);
      }

      // Report statistics periodically
      const now = currentTime;
      if (now - this.lastStatsReport > this.statsInterval) {
        this.sendStats();
        this.lastStatsReport = now;
      }

      // Log progress occasionally
      if (this.processCount % 2000 === 0) {
        const silentPercentage = (this.silentCount / this.processCount) * 100;
        console.log(`📊 Worklet processed ${this.processCount} chunks, ${silentPercentage.toFixed(1)}% silent`);
        
        if (silentPercentage > 95) {
          console.warn('⚠️ Very high silence rate - check microphone or input gain');
        }
      }

    } catch (error) {
      console.error('❌ Worklet processing error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        processCount: this.processCount
      });
      
      // Don't stop processing due to errors, just log them
    }

    return true; // Keep the processor alive
  }

  // Apply simple smoothing filter to reduce noise
  applySmoothingFilter(audioData) {
    try {
      const alpha = 0.1; // Smoothing factor (0 = no smoothing, 1 = maximum smoothing)
      
      for (let i = 0; i < audioData.length; i++) {
        // Simple exponential moving average
        this.smoothingBuffer[this.bufferIndex] = audioData[i];
        
        if (i > 0) {
          audioData[i] = alpha * audioData[i] + (1 - alpha) * audioData[i - 1];
        }
        
        this.bufferIndex = (this.bufferIndex + 1) % this.smoothingBuffer.length;
      }
    } catch (filterError) {
      console.warn('Smoothing filter error:', filterError);
    }
  }

  // Send current statistics to main thread
  sendStats() {
    try {
      const avgAmplitude = this.sampleCount > 0 ? 
        this.totalAmplitude / this.sampleCount : 0;
      
      const silentPercentage = this.processCount > 0 ? 
        (this.silentCount / this.processCount) * 100 : 0;

      const stats = {
        type: 'stats',
        processCount: this.processCount,
        sampleCount: this.sampleCount,
        silentCount: this.silentCount,
        silentPercentage: silentPercentage,
        maxAmplitude: this.maxAmplitude,
        avgAmplitude: avgAmplitude,
        isActive: this.isActive
      };

      this.port.postMessage({
        type: 'statistics',
        data: stats
      });

    } catch (statsError) {
      console.error('Failed to send stats:', statsError);
    }
  }

  // Override the parameterDescriptors if needed
  static get parameterDescriptors() {
    return [];
  }
}

// Register the processor
registerProcessor("recorder-worklet-processor", RecorderWorkletProcessor);

console.log('✅ RecorderWorkletProcessor registered successfully');
