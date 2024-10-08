import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import Input from "../components/Input";
import Button from "../components/Button";
import { addElementsToProject } from "../services/elementService";
import { setInterceptor } from "../services/apiClient";

type Category = 'box' | 'sprue' | 'printed' | 'assembled' | 'primed' | 'halfPainted' | 'painted' | 'finished';


interface OpenCategories {
    box: boolean,
    sprue: boolean,
    printed: boolean,
    assembled: boolean,
    primed: boolean,
    halfPainted: boolean,
    painted: boolean,
    finished: boolean
}

interface Summary {
    box: number,
    sprue: number,
    printed: number,
    assembled: number,
    primed: number,
    halfPainted: number,
    painted: number,
    finished: number
}

interface Line {
    name: string,
    amount: string
}

interface ElementsToSend {
    projectId: string | number,
    statuses: StatusesToSend
}

interface StatusesToSend {
    box: Array<Line>,
    sprue: Array<Line>,
    printed: Array<Line>,
    assembled: Array<Line>,
    primed: Array<Line>,
    halfPainted: Array<Line>,
    painted: Array<Line>,
    finished: Array<Line>
}

const AddElements = () => {
    const { projectId } = useParams();
    const [openCategories, setOpenCategories] = useState<OpenCategories>({
        box: false,
        sprue: false,
        printed: false,
        assembled: false,
        primed: false,
        halfPainted: false,
        painted: false,
        finished: false
    });
    const [elementsToSend, setElementsToSend] = useState<ElementsToSend>({
        projectId: projectId!,
        statuses: {
            box: [{ name: "", amount: "0" }],
            sprue: [{ name: "", amount: "0" }],
            printed: [{ name: "", amount: "0" }],
            assembled: [{ name: "", amount: "0" }],
            primed: [{ name: "", amount: "0" }],
            halfPainted: [{ name: "", amount: "0" }],
            painted: [{ name: "", amount: "0" }],
            finished: [{ name: "", amount: "0" }]
        }
    });

    const [summary, setSummary] = useState<Summary>({
        box: 0,
        sprue: 0,
        printed: 0,
        assembled: 0,
        primed: 0,
        halfPainted: 0,
        painted: 0,
        finished: 0
    });

    const [totalMinis, setTotalMinis] = useState<number>(0);

    const navigate = useNavigate();

    const categories: Category[] = ['box', 'sprue', 'printed', 'assembled', 'primed', 'halfPainted', 'painted', 'finished'];

    useEffect(() => {
        setInterceptor(navigate);
    }, [navigate])

    const toggleCategory = (category: Category) => {
        setOpenCategories({
            ...openCategories,
            [category]: !openCategories[category]
        })
    }

    const handleAddLineToCategory = (category: Category) => {
        const updatedLines = [...elementsToSend.statuses[category], { name: '', amount: 0 }];
        setElementsToSend((prevState) => ({
            ...prevState,
            statuses: {
                ...prevState.statuses,
                [category]: updatedLines
            }
        }))
    }

    const handleLineChange = (category: Category, index: number) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setElementsToSend((prev) => {
            const updatedLines = [...prev.statuses[category]];
            updatedLines[index] = { ...updatedLines[index], [name]: value };
            return {
                ...prev,
                statuses: {
                    ...prev.statuses,
                    [category]: updatedLines,
                },
            };
        });

        if (name === 'amount') {
            const oldAmount = elementsToSend.statuses[category][index].amount;
            const newAmount = parseInt(value);
            const amountDifference = newAmount - parseInt(oldAmount);
            setSummary(prevState => {
                return {
                    ...prevState,
                    [category]: prevState[category] + amountDifference,
                }
            })
            setTotalMinis(totalMinis + amountDifference)
        }
    };

    const handleSendElements = async () => {
        await addElementsToProject(elementsToSend);
        navigate(`/project/${projectId}`)
    }


    return (
        <div className="flex flex-col px-10 text-offWhite font-display">

            <div className="flex gap-x-3 items-center">
                <div onClick={() => navigate(`/project/${projectId}`)} className="hover:text-lightTeal transition-all duration-100 hover:cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                </div>
                <h1 className="text-3xl font-semibold uppercase">Add elements</h1>
            </div>
            <div className="flex gap-x-5">
                <div className="flex flex-col p-3 w-2/3 gap-y-5">
                    {categories.map((category) => (
                        <div className="flex flex-col" key={category}>
                            <div onClick={() => toggleCategory(category)} className="flex justify-between bg-darkGrey h-10 items-center px-3 text-lightTeal">
                                <p>{category === 'halfPainted' ? 'HALF-PAINTED' : category.toUpperCase()}</p>
                                {openCategories[category] ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                    </svg>
                                )}
                            </div>
                            {openCategories[category] && (
                                <div className="flex flex-col w-full items-center justify-center border-x border-b border-lightTeal p-3 rounded-b-md">
                                    {elementsToSend.statuses[category].map((line, index) => (
                                        <div className="flex gap-x-3 w-full" key={index}>
                                            <div className="w-5/6">
                                                <Input type="text" name="name" value={elementsToSend.statuses[category][index].name} onChange={handleLineChange(category, index)} />
                                            </div>
                                            <div className="w-1/6">
                                                <Input type="number" name="amount" value={elementsToSend.statuses[category][index].amount} onChange={handleLineChange(category, index)} />
                                            </div>
                                        </div>
                                    ))}
                                    <div
                                        className="my-2 w-3/4 bg-darkGrey rounded-md border border-lightTeal text-lightTeal flex justify-center h-8 items-center hover:cursor-pointer hover:text-offWhite transition-all duration-100"
                                        onClick={() => handleAddLineToCategory(category)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    <div className="flex justify-center">
                        <Button buttonType="button" text="add elements" onClick={handleSendElements} />
                    </div>
                </div>
                <div className="w-1/3 bg-darkGrey p-5 text-xl uppercase flex flex-col mb-3 max-h-[500px]">
                    <div className="text-darkTeal text-3xl pb-3">SUMMARY</div>
                    {Object.entries(summary)
                        .filter(([key, value]) => value > 0)
                        .map(([key, value]: [string, number]) => (
                            <div key={key} className="flex items-center gap-3">
                                <div className="text-lightTeal">{value}</div>
                                <div className="text-sm">x</div>
                                <div>{key === 'halfPainted' ? 'half-painted' : key}</div>
                            </div>
                        ))}
                    <div className="text-center text-3xl text-lightTeal uppercase mt-auto">{totalMinis} miniatures</div>
                </div>
            </div>
        </div>
    )
}

export default AddElements