// vite-project/src/components/CsvUploader.tsx

import {
  Box,
  Button,
  Container,
  LinearProgress,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { ChangeEvent, useRef, useState } from "react";
import { CommentTable } from "./CommentTable";

interface DataItem {
  [key: string]: string;
}

type CsvUploaderProps = object;

interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & { files: FileList };
}

const CsvUploader: React.FC<CsvUploaderProps> = () => {
  const [comments, setComments] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getCommentsData = async (search?: string) => {
    try {
      const urlParams = new URLSearchParams(window.location.search);

      // Extract query parameters using the `get` method
      const limitStr = urlParams.get("limit"); // Example: '10' or null
      const pageStr = urlParams.get("page"); // Example: '5' or null

      // Convert limit and offset to numbers, handling potential null values
      const limit = limitStr ? parseInt(limitStr, 10) : 10;
      const page = pageStr ? parseInt(pageStr, 10) : 1;

      const response = await axios.get("http://localhost:3000/comments", {
        params: {
          limit: limit,
          page: page,
          searchterm: search,
        },
      });

      setComments(response.data.data);
      const totalCount = response.data.total;
      setTotalPages(Math.ceil(totalCount / limit));
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = async (event: FileChangeEvent): Promise<void> => {
    const file = event.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post<{ message: string }>(
        "http://localhost:3000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      await getCommentsData();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const handlePageChange = async (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("page", String(value));
    window.history.pushState(
      { page: value },
      `Page ${value}`,
      newUrl.toString()
    );

    await getCommentsData();
  };

  return (
    <Container maxWidth="lg">
      <Box>
        <h1>CSV Uploader</h1>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        {uploadProgress !== null && (
          <LinearProgress
            variant="determinate"
            value={uploadProgress}
            sx={{ mt: 2 }}
          />
        )}

        <TextField
          size="small"
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <Button onClick={() => getCommentsData(searchQuery)}>Search</Button>

        {comments.length > 0 && totalPages && (
          <CommentTable
            totalPages={totalPages}
            page={page}
            handlePageChange={handlePageChange}
            paginatedData={comments}
          />
        )}

        {(comments.length <= 0 || totalPages <= 0) && <p>No results found.</p>}
      </Box>
    </Container>
  );
};

export default CsvUploader;
