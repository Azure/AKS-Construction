import React, { useState, useEffect } from 'react';
import { MessageBar, DocumentCardActivity, DocumentCardImage, Text, DocumentCardPreview, mergeStyles, Separator, DocumentCard, DocumentCardDetails, Stack, Checkbox, ImageFit } from '@fluentui/react';

const iconClass = mergeStyles({
    fontSize: 80,
    margin: '0 80px'
});


export default function ({ sections, updateCardValues }) {

    const [selected, setSelected] = useState({})

    useEffect(() => {
        // dateValues for defaults
        setSelected(sections.reduce((a, s) => { return { ...a, [s.key]: s.cards.find(c => c.default).key } }, {}))

        for (let s of sections) {
            const defCard = s.cards.find(c => c.default)
            if (defCard) {
                updateCardValues(s.key, defCard.key)
            }
        }
    }, [sections])

    function apply(sectionKey, cardKey) {
        setSelected({ ...selected, [sectionKey]: cardKey })
        updateCardValues(sectionKey, cardKey)
    }

    console.log(`presets render: selected=(${JSON.stringify(selected)})`)
    return [].concat.apply([], sections.map(s => [


        <Separator key={`sep${s.key}`} styles={{ root: { marginTop: "15px !important", marginBottom: "15px" } }}><b>{s.sectionTitle}</b></Separator>,

        <Stack key={`stack${s.key}`} horizontal tokens={{ childrenGap: 30 }}>
            {s.cards.map((c, i) =>
                <DocumentCard
                    key={c.key}
                    onClick={() => apply(s.key, c.key)}
                    tokens={{ childrenMargin: 12 }}
                >
                    <DocumentCardDetails styles={{ root: { padding: "8px 16px", position: "relative" } }}>
                        <Checkbox checked={selected[s.key] === c.key} label={c.title} styles={{ label: { fontWeight: selected[s.key] === c.key ? '500' : 'normal' } }} />

                    </DocumentCardDetails>

                    {c.imageSrc &&
                        <DocumentCardImage imageSrc={c.imageSrc} height={150} imageFit={ImageFit.centerContain} />
                    }
                    {c.icon &&
                        <DocumentCardPreview styles={{ root: { backgroundColor: 'white', borderBottom: '0' } }} previewImages={[{
                            previewIconProps: {
                                iconName: c.icon, className: iconClass
                            }, height: 100
                        },]} />
                    }

                    <div style={{ padding: "8px 16px" }} >
                        <Text >{c.description.title}
                            {c.description.titleWarning &&
                                <MessageBar messageBarType={c.description.titleWarning.MessageBarType}>
                                    <Text >{c.description.titleWarning.description}</Text>
                                </MessageBar>

                            }
                            <Text variant="smallPlus" >
                                <ul>
                                    {c.description.bulets.map((b, i) =>
                                        <li key={i}>
                                            {b.description}
                                            {b.linksrc && <span> (<a target="_nsg" href={b.linksrc}>docs</a>)</span>}
                                        </li>
                                    )}
                                </ul>
                            </Text>
                        </Text>
                    </div>

                    {c.author &&
                        <DocumentCardActivity activity={c.author.status} people={[{ name: c.author.name, initials: c.author.initials }]} />
                    }
                </DocumentCard>
            )}
        </Stack>
    ]))
}