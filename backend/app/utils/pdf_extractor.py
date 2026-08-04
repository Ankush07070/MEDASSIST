import fitz


class PDFExtractor:

    @staticmethod
    def extract_text(file_path: str) -> str:
        """
        Extract text from a PDF.
        """

        document = fitz.open(file_path)

        pages = []

        for page in document:
            pages.append(page.get_text())

        document.close()

        return "\n".join(pages).strip()
    