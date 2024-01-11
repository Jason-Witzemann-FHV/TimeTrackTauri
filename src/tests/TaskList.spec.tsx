import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@solidjs/testing-library";
import "@testing-library/jest-dom";
import TaskList from "../components/TaskList";
import { TaskI } from "../types/TaskI";
import { invoke } from "@tauri-apps/api";
import { createResource } from "solid-js";

// Source: https://yonatankra.com/how-to-setup-vitest-in-a-tauri-project/
describe("<TaskList />", () => {
    it("should be empty", () => {
        const { container, unmount } = render(() => (
            <TaskList tasks={[]} editTaskCall={() => []} isFiltered={false} />
        ));
        expect(container).toBeEmptyDOMElement();
        unmount();
    });

    it("should contain 2 dayGroup", () => {
        const givenTasks: TaskI[] = [
            {
                id: 1,
                name: "Test Task",
                color: "#00ffff",
                start_date: Date.now().toString(),
                end_date: new Date(Date.now() + 3600000).toString(),
                description: "Test Description",
            },
            {
                id: 2,
                name: "Test Task 2",
                color: "#00ffff",
                start_date: new Date(Date.now() - 360000000).toString(),
                end_date: new Date(Date.now() - 320000000).toString(),
                description: "Test Description 2",
            },
        ];

        const { container, unmount } = render(() => (
            <TaskList
                tasks={givenTasks}
                editTaskCall={() => []}
                isFiltered={false}
            />
        ));
        expect(container.getElementsByClassName("collapse").length).toBe(2);
        expect(container.getElementsByClassName("collapse")[0]).not.toBeNull();
        expect(container.getElementsByClassName("collapse")[1]).not.toBeNull();
        unmount();
    });

    it("should open todays dayGroup", () => {
        const givenTasks: TaskI[] = [
            {
                id: 1,
                name: "Test Task",
                color: "#00ffff",
                start_date: Date.now().toString(),
                end_date: new Date(Date.now() + 3600000).toString(),
                description: "Test Description",
            },
        ];
        const { container, unmount } = render(() => (
            <TaskList
                tasks={givenTasks}
                editTaskCall={() => []}
                isFiltered={false}
            />
        ));
        expect(
            container.getElementsByClassName("collapse-open")[0]
        ).not.toBeNull();
        unmount();
    });

    it("should open all dayGroups when filtered", () => {
        const givenTasks: TaskI[] = [
            {
                id: 1,
                name: "Test Task",
                color: "#00ffff",
                start_date: Date.now().toString(),
                end_date: new Date(Date.now() + 3600000).toString(),
                description: "Test Description",
            },
            {
                id: 2,
                name: "Test Task 2",
                color: "#00ffff",
                start_date: new Date(Date.now() - 360000000).toString(),
                end_date: new Date(Date.now() - 320000000).toString(),
                description: "Test Description 2",
            },
            {
                id: 2,
                name: "Test Task 3",
                color: "#00ffff",
                start_date: new Date(Date.now() - 360000000 * 2).toString(),
                end_date: new Date(Date.now() - 320000000 * 2).toString(),
                description: "Test Description 3",
            },
        ];

        const { container, unmount } = render(() => (
            <TaskList
                tasks={givenTasks}
                editTaskCall={() => []}
                isFiltered={true}
            />
        ));
        expect(container.getElementsByClassName("collapse-open").length).toBe(
            3
        );
        unmount();
    });

    it("should call editTaskCall when edit button is clicked", () => {
        const givenTasks: TaskI[] = [
            {
                id: 1,
                name: "Test Task",
                color: "#00ffff",
                start_date: Date.now().toString(),
                end_date: new Date(Date.now() + 3600000).toString(),
                description: "Test Description",
            },
        ];

        function testEdit(task: TaskI): void {}
        const mock = vi.fn().mockImplementation(testEdit);

        const { container, unmount } = render(() => (
            <TaskList
                tasks={givenTasks}
                editTaskCall={mock}
                isFiltered={false}
            />
        ));
        const editButton = container.getElementsByClassName("btn-edit")[0];
        fireEvent.click(editButton);

        expect(mock).toHaveBeenCalledOnce();
        expect(mock).toHaveBeenCalledWith(givenTasks[0]);
        unmount();
    });
});
