"""Backward-compatible entry point for the cinematic standalone exporter."""
from pathlib import Path
import runpy
runpy.run_path(str(Path(__file__).with_name("cinematic-preview.py")),run_name="__main__")
