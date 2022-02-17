/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useTheme, MessageBar, DocumentCardActivity, DocumentCardImage, DocumentCardTitle, Text, DocumentCardPreview, mergeStyles, Separator, DocumentCard, DocumentCardDetails, Stack, Checkbox, ImageFit, MessageBarType } from '@fluentui/react';

const iconClass = mergeStyles({
    fontSize: 80,
    margin: '0 80px'
});


export default function ({ sections, selectedValues, updateSelected, featureFlag }) {

    const bodyBackground = useTheme().semanticColors.bodyBackground;

    return sections.map(s => [


        <Separator key={`sep${s.key}`} styles={{ root: { marginTop: "15px !important", marginBottom: "15px" } }}><b>{s.sectionTitle}</b></Separator>,
        <div key={`warn${s.key}`}>
            {s.sectionWarning &&
                <MessageBar key={`messg${s.key}`} styles={{ root: { marginBottom: "15px", fontSize: "15px" } }} messageBarType={MessageBarType.severeWarning}>{s.sectionWarning}</MessageBar>
            }
        </div>,
        <Stack key={`stack${s.key}`} horizontal tokens={{ childrenGap: 15 }}>
            {s.cards.map((c, i) =>
                <DocumentCard  key={c.key}   onClick={() => updateSelected(s.key, c.key)} tokens={{ childrenMargin: 12 }}>

                    <DocumentCardDetails styles={{ root: { padding: "8px 16px", position: "relative" } }}>
                        <Checkbox inputProps={{ 'data-testid': `portalnav-presets-${s.key}-${c.key}-Checkbox`}} checked={selectedValues[s.key] === c.key} label={c.title} styles={{ label: { fontWeight: selectedValues[s.key] === c.key ? '500' : 'normal' } }} />
                    </DocumentCardDetails>

                    {c.imageSrc &&
                        <DocumentCardImage styles={{ root: { backgroundColor: bodyBackground } }} imageSrc={c.imageSrc} height={150} imageFit={ImageFit.centerContain} />
                    }
                    {c.icon &&
                        <DocumentCardPreview styles={{ root: { backgroundColor: bodyBackground, borderBottom: '0' } }} previewImages={[{
                            previewIconProps: {
                                iconName: c.icon, className: iconClass
                            }, height: 100
                        },]} />
                    }

                    <DocumentCardTitle showAsSecondaryTitle={true} shouldTruncate={false} title={c.description.title}/>

                    <div style={{ padding: "8px 16px" }} >
                        <Text>
                            {c.description.titleWarning &&
                                <MessageBar messageBarType={c.description.titleWarning.MessageBarType}>
                                    <Text >{c.description.titleWarning.description}</Text>
                                </MessageBar>

                            }
                            <Text variant="smallPlus" >
                                <ul style={{ paddingInlineStart: "20px" }}>
                                    {c.description.bulets.filter(b=> !b.hasOwnProperty('featureFlag') || featureFlag.includes(b.featureFlag) ).map((b, i) =>
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
    ])
}