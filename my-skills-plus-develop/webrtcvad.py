"""Local stub so profilers can load without compiling webrtcvad on Windows."""


class Vad:
    def __init__(self, mode=3):
        self.mode = mode

    def is_speech(self, frame, sample_rate):
        return True
