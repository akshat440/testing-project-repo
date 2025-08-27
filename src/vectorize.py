"""
Vectorize k-mer sequences into numeric feature vectors for ML
"""

from sklearn.feature_extraction.text import CountVectorizer

# Initialize a global vectorizer so that the same vocabulary is used for train & test
vectorizer = CountVectorizer(analyzer=lambda x: x)  # x is already a list of k-mers

def vectorize_features(kmer_lists):
    """
    kmer_lists: list of lists of k-mers
    Returns: feature matrix (sparse or dense)
    """
    X = vectorizer.transform(kmer_lists) if hasattr(vectorizer, 'vocabulary_') else vectorizer.fit_transform(kmer_lists)
    return X
