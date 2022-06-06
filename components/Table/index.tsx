import React, { useState } from "react";
import { useTable, useSortBy, useFilters, useGlobalFilter, useAsyncDebounce, Row, usePagination } from "react-table";

import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { TableInterface } from "./interfaces/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function RootTable(props: TableInterface) {
    if (!props.data) {
        return <div className="flex justify-center">Loading...</div>;
    }

    if (props.data.length === 0) {
        return <div className="flex justify-center">ไม่มีข้อมูล</div>;
    }

    return (
        <>
            <Table {...props} />
        </>
    );
}

function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
}: { preGlobalFilteredRows: Row<object>[], globalFilter: any, setGlobalFilter: any }) {
    const count = preGlobalFilteredRows.length
    const [value, setValue] = React.useState(globalFilter)
    const onChange = useAsyncDebounce(value => {
        setGlobalFilter(value || undefined)
    }, 200)

    return (
        <div className="flex gap-2 items-center input input-sm">
            <FontAwesomeIcon icon={faSearch} />
            <input value={value || ""} onChange={e => {
                setValue(e.target.value);
                onChange(e.target.value);
            }} type="text" placeholder={`ค้นหา ${count} records...`} className="form-control" />

        </div>
    )
}

function Table(props: TableInterface) {
    const { getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        preGlobalFilteredRows,
        setGlobalFilter,

        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } =
        useTable(
            {
                columns: props.columns || [],
                data: props.data || [],
                initialState: {
                    sortBy: props?.sortBy || [],
                    pageIndex: 0,
                    pageSize: 5
                },
            },
            useGlobalFilter,
            useSortBy,
            usePagination,
        );

    return (
        <div className={`flex flex-col gap-3 ${props.title.length !== 0 ? "py-3" : ""} md:p-0`}>
            <div className="flex flex-col md:flex-row gap-2 justify-between items-center">
                <div className="text-xl">{props.title}</div>
                <div className="">
                    <GlobalFilter
                        preGlobalFilteredRows={preGlobalFilteredRows}
                        globalFilter={state.globalFilter}
                        setGlobalFilter={setGlobalFilter}
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className={`table table-striped`}>
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th
                                        className="select-none"
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                    >
                                        <div className="flex gap-2 items-center">
                                            <div>{column.render("Header")}</div>
                                            <div>
                                                {column.isSorted ? (
                                                    column.isSortedDesc ? (
                                                        <AiFillCaretDown />
                                                    ) : (
                                                        <AiFillCaretUp />
                                                    )
                                                ) : (
                                                    ""
                                                )}
                                            </div>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="select-none" {...getTableBodyProps()}>
                        {page.map((row) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell) => {
                                        return (
                                            <td {...cell.getCellProps()}>
                                                <div className="truncate max-w-sm">{cell.render("Cell")}</div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex flex-col md:flex-row gap-2 items-center">
                    <div className="flex gap-1">
                        <button className="btn btn-sm btn-primary" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                            {'<<'}
                        </button>
                        <button className="btn btn-sm btn-primary" onClick={() => previousPage()} disabled={!canPreviousPage}>
                            {'<'}
                        </button>
                        <button className="btn btn-sm btn-primary" onClick={() => nextPage()} disabled={!canNextPage}>
                            {'>'}
                        </button>
                        <button className="btn btn-sm btn-primary" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                            {'>>'}
                        </button>
                    </div>
                    <div className="select-none whitespace-nowrap">
                        Page {pageIndex + 1} of {pageOptions.length}
                    </div>
                    <select
                        className="form-select"
                        value={pageSize}
                        onChange={e => {
                            setPageSize(Number(e.target.value))
                        }}
                    >
                        {[5, 10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                แสดง {pageSize} รายการ
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    {rows.length} รายการ
                </div>
            </div>
        </div>
    );
}