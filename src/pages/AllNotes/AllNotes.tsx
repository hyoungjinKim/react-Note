import React, { useState } from "react";
import { FiltersModal } from "../../components";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { toggleFiltersModal } from "../../store/modal/modalSlice";
import { ButtonOutline, Container, EmptyMsgBox } from "../../styles/styles";
import getAllNotes from "../../utils/getAllNotes";
import { Box, InputBox, TopBox } from "./AllNotes.styles";

const AllNotes = () => {
  const dispatch = useAppDispatch();
  const { mainNotes } = useAppSelector((state) => state.notesList);
  const { viewFiltersModal } = useAppSelector((state) => state.modal);
  const [filter, setFilter] = useState("");

  const filterHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const clearHandler = () => {
    setFilter("");
  };

  return (
    <Container>
      {viewFiltersModal && (
        <FiltersModal
          handleFilter={filterHandler}
          handleClear={clearHandler}
          filter={filter}
        />
      )}

      {mainNotes.length === 0 ? (
        <EmptyMsgBox>노트가 없습니다.</EmptyMsgBox>
      ) : (
        <>
          <TopBox>
            <div className="notes__filter-btn">
              <ButtonOutline
                onClick={() => dispatch(toggleFiltersModal(true))}
                className="nav__btn"
              >
                <span>정렬</span>
              </ButtonOutline>
            </div>
          </TopBox>

          <Box>
            {/* Notes */}
            {getAllNotes(mainNotes, filter)}
          </Box>
        </>
      )}
    </Container>
  );
};

export default AllNotes;
