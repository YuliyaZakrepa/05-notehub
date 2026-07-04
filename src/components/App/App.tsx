
import css from "./App.module.css";

import NoteList from "../NoteList/NoteList";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import { fetchNotes } from "../../services/noteService";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import toast, { Toaster } from "react-hot-toast";



export default function App() {
  const [search, setSearch] = useState<string | "">("");
  const [page, setPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { data, isError, isSuccess, isFetching } = useQuery({
    queryKey: ["notes", search, page,12],
    queryFn: () => fetchNotes(search, page,12),
    placeholderData: keepPreviousData,
  });
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
   const notes = data?.notes || [];
  const totalPages = data?.totalPages || 0;

  const handleSearch = useDebouncedCallback((search:string) => {
    setSearch(search);
    setPage(1);
  }, 1000);
 
  useEffect(() => {
    if (isSuccess && notes.length === 0 && !isFetching && search.trim() !== "") {
      toast.error("No notes found for your request.");
     
    }
  }, [isSuccess, notes, isFetching, search]);
 
  return (
    <div className={css.app}>
      <Toaster />
      <header className={css.toolbar}>
        {<SearchBox onSearch={handleSearch} />}
        {isSuccess && totalPages > 1 && (
          <Pagination 
          totalPages={totalPages}
          page={page}
          onPageChange={setPage}/>
        )}

        <button className={css.button} onClick={handleOpenModal}>
          Create note +
        </button>
      </header>
      <div>
      {isFetching && <Loader />}
      {isError && <ErrorMessage />}
      {isSuccess && notes.length > 0 && <NoteList notes={notes} />}
      </div>
       {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          {<NoteForm onClose={handleCloseModal} />}
        </Modal>
      )}
    </div>
  );
}
