import unittest
import subprocess


class TestValidateData(unittest.TestCase):
    def test_missing_args(self):
        """Test that running the script without arguments returns exit code 1."""
        result = subprocess.run(
            ["python3", "scripts/validate_data.py"], capture_output=True, text=True
        )
        self.assertEqual(result.returncode, 1)
        self.assertIn("Usage:", result.stdout)


if __name__ == "__main__":
    unittest.main()
