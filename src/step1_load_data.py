import pandas as pd

def load_csv(file_path):
    """
    Load a CSV file and return a pandas DataFrame.
    file_path: path to the CSV file
    """
    df = pd.read_csv(file_path, header=0)  # change header=None if your CSV has no header
    return df
