export const getSegmentFilter = (segmentKey, model) => {
    const { segments } = model.options
    if (!segments) return { hasFilter: false, where: {} }
    const segment = segments.find(s => s.segmentKey === segmentKey)
    if (!segment) return { hasFilter: false, where: {} }
    const { segmentField, segmentValue, where } = segment
    if (segmentField) {
        return { hasFilter: true, where: { [segmentField]: segmentValue } }
    }
    return { hasFilter: true, where}
};