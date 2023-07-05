import { mergeStyles } from '../../Styling';
import { memoizeFunction } from '../../Utilities';
export var getClassNames = memoizeFunction(function (styles, className, activityPersonas, isCompact) {
    return {
        root: mergeStyles('ms-ActivityItem', className, styles.root, isCompact && styles.isCompactRoot),
        pulsingBeacon: mergeStyles('ms-ActivityItem-pulsingBeacon', styles.pulsingBeacon),
        personaContainer: mergeStyles('ms-ActivityItem-personaContainer', styles.personaContainer, isCompact && styles.isCompactPersonaContainer),
        activityPersona: mergeStyles('ms-ActivityItem-activityPersona', styles.activityPersona, isCompact && styles.isCompactPersona, !isCompact && activityPersonas && activityPersonas.length === 2 && styles.doublePersona),
        activityTypeIcon: mergeStyles('ms-ActivityItem-activityTypeIcon', styles.activityTypeIcon, isCompact && styles.isCompactIcon),
        activityContent: mergeStyles('ms-ActivityItem-activityContent', styles.activityContent, isCompact && styles.isCompactContent),
        activityText: mergeStyles('ms-ActivityItem-activityText', styles.activityText),
        commentText: mergeStyles('ms-ActivityItem-commentText', styles.commentText),
        timeStamp: mergeStyles('ms-ActivityItem-timeStamp', styles.timeStamp, isCompact && styles.isCompactTimeStamp),
    };
});
//# sourceMappingURL=ActivityItem.classNames.js.map