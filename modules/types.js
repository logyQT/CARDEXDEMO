/**
 * @typedef {Object} SaveObjectRoot
 * @property {AdditionalGameData} AdditionalGameData
 * @property {Economy} Economy
 * @property {Object} EventHandler
 * @property {Inventory} Inventory
 * @property {PlayerPawn} PlayerPawn
 * @property {PlayerStorage} PlayerStorage
 * @property {Object} SideEventsManager
 * @property {Object} UpgradeSystem
 * @property {VehicleSystem} VehicleSystem
 * @property {Object.<string, RunTimeObject>} RuntimeObjects
 * @description Main save object parsed from the database.
 */

/**
 * @typedef {Object} RunTimeObject
 * @property {string} ActorClass
 * @property {boolean} InHand
 * @property {RunTimeObject.SaveInfo} SaveInfo
 * @property {boolean} bCanBeDamaged
 * @property {string} customData
 * @property {boolean} isInSaveSystem
 */

/**
 * @typedef {Object} RunTimeObject.SaveInfo
 * @property {string} carId
 * @property {boolean} possessed
 * @property {transform} transform
 */

/**
 * @typedef {Object} VehicleSystem
 * @property {[]} LevelPlacedDeletedVehicles
 * @property {Vehicle[]} VehicleInfo
 */

/**
 * @typedef {Object} Vehicle
 * @property {VehicleData} [Vehicle]
 * @property {Washable} [Washable]
 * @property {Offer} [Offer]
 * @property {brakesParts} brakesParts
 * @property {number} buyingCarPartsScore
 * @property {number} buyingMarketPrice
 * @property {number} buyingPlayerPrice
 * @property {boolean} canCreateOffer
 * @property {[]} capturedPoints
 * @property {number} capturedPointsInOffer
 * @property {number} capturedPointsMax
 * @property {string} carId
 * @property {boolean} carplateCleaned
 * @property {string} carplateId
 * @property {clutchParts} clutchParts
 * @property {vehicleColor} color
 * @property {dateObject} createdTimeInWorld
 * @property {number} curPolishValue
 * @property {number} curWashValue
 * @property {number} currentDirtValue
 * @property {number} currentMileage
 * @property {number} currentRustValue
 * @property {number} dirtTextureMaskIndex
 * @property {electricParts} electricParts
 * @property {engineParts} engineParts
 * @property {Object} exhaustHoles
 * @property {exhaustParts} exhaustParts
 * @property {string} fuelType
 * @property {fusesState} fusesState
 * @property {number} garageEntryFuel
 * @property {string} garageVehicleJsonData
 * @property {string} gearboxType
 * @property {number} initMileage
 * @property {number} initPolishValue
 * @property {number} initWashValue
 * @property {boolean} initWashValuesSet
 * @property {number} initialDirtValue
 * @property {number} initialRustValue
 * @property {boolean} isAbandonedWreck
 * @property {boolean} isWreckForSell
 * @property {miscParts} miscParts
 * @property {string} modelName
 * @property {number} odometerDurability
 * @property {number} odometerMileageLimit
 * @property {number} odometerMileageOrigin
 * @property {boolean} photoMadeByPhotoStudio
 * @property {boolean} playerOwned
 * @property {number} productionYear
 * @property {radiatorParts} radiatorParts
 * @property {number} rustTextureMaskIndex
 * @property {number} sellingPlayerPrice
 * @property {number} startDirtValue
 * @property {number} startRustValue
 * @property {suspentionParts} suspentionParts
 * @property {number} vehicleScoreCache
 * @property {boolean} wasWreck
 */

/**
 * @typedef {Object} VehicleData
 * @property {string} ActorClass
 * @property {transform} ActorTransform
 * @property {string} HauledVehicle
 * @property {ItemContainer} ItemContainer
 * @property {boolean} bCanBeDamaged
 * @property {boolean} bIsParked
 * @property {string} carPlateName
 * @property {number} fuel
 * @property {boolean} fuelCoverIsOpen
 * @property {boolean} isHauled
 * @property {levelPlacedVehicleSettings} levelPlacedVehicleSettings
 * @property {string} modelName
 * @property {boolean} playerPossesed
 * @property {boolean} radioOn
 * @property {number} radioStationIndex
 */

/**
 * @typedef {Object} Washable
 * @property {string} ActorClass
 * @property {transform} ActorTransform
 * @property {boolean} bCanBeDamaged
 * @property {number} dirtTextureMaskIndex
 * @property {number} rustTextureMaskIndex
 * @property {string} washableUniqueIndex
 */

/**
 * @typedef {Object} Offer
 * @property {number} daysLeft
 * @property {boolean} isInCart
 * @property {boolean} isInFavourites
 * @property {boolean} isScheduled
 * @property {number} offerPrice
 * @property {string} parkingSlotId
 * @property {string[]} photos
 * @property {string[]} playerPhotoPaths
 * @property {string} spawnPointIndex
 */

/**
 * @typedef {Object} PlayerStorage
 * @property {Items} Items
 */

/**
 * @typedef {Object} PlayerPawn
 * @property {string[]} PlayerTools
 * @property {PlayerPawn.SaveInfo} SaveInfo
 * @property {availablePlayerTools} availablePlayerTools
 * @property {boolean} bCanBeDamaged
 */

/**
 * @typedef {Object} availablePlayerTools
 * @property {boolean} Scanner
 * @property {boolean} FlashLight
 * @property {boolean} Odometer
 */

/**
 * @typedef {Object} PlayerPawn.SaveInfo
 * @property {string} carId
 * @property {boolean} possessed
 * @property {transform} transform
 */

/**
 * @typedef {Object} Inventory
 * @property {Items} Items
 */

/**
 * @typedef {Object} Economy
 * @property {SaveInfo} SaveInfo
 * @property {boolean} additionalRepairMachine
 * @property {boolean} billsQuestLaunched
 * @property {boolean} billsUnlocked
 * @property {[]} carsExcludedFromSelling
 * @property {number} currentZoomLevel
 * @property {number} cycle
 * @property {number} cyclingLevel
 * @property {number} dayCounter
 * @property {string} gameDateTime
 * @property {boolean} hasElectricTools
 * @property {boolean} isInternalCamera
 * @property {boolean} loanNotificationDisplayed
 * @property {transaction[]} moneyTransactions
 * @property {string} nextRandomCarMail
 * @property {number} playerMoney
 * @property {number} reputationExperience
 * @property {boolean} showToolTips
 * @property {string} sortTypeCached
 * @property {string[]} tutorialsShown
 * @property {unlockedApps} unlockedApps
 * @property {number} vehicleSpringArmLength
 */

/**
 * @typedef {Object.<number, boolean>} unlockedApps
 * @property {boolean} [1]
 * @property {boolean} [2]
 * @property {boolean} [3]
 * @property {boolean} [4]
 * @property {boolean} [5]
 * @property {boolean} [6]
 * @property {boolean} [7]
 * @property {boolean} [8]
 * @property {boolean} [9]
 * @property {boolean} [10]

/**
 * @typedef {Object} SaveInfo
 * @property {mailData[]} mailData
 * @property {photoInfo[]} photoInfos
 */

/**
 * @typedef {Object} mailData
 * @property {[]} attachments
 * @property {string} content
 * @property {string} date
 * @property {string} footer
 * @property {string} from
 * @property {boolean} isQuest
 * @property {boolean} isTrash
 * @property {boolean} isUnread
 * @property {boolean} playerResponded
 * @property {string} questId
 * @property {string} subject
 */

/**
 * @typedef {Object} photoInfo
 * @property {string[]} capturedTags
 * @property {string} carIndex
 * @property {string} filePath
 * @property {boolean} madeByPhotoStudio
 * @property {number} pointsCaptured
 * @property {string} texture
 */

/**
 * @typedef {Object} transaction
 * @property {number} amount
 * @property {dateObject} date
 * @property {string} name
 */

/**
 * @typedef {Object} dateObject
 * @property {number} day
 * @property {string} time
 */

/**
 * @typedef {Object} AdditionalGameData
 * @property {BillsAndLoans} BillsAndLoans
 * @property {BrandData} BrandData
 * @property {GameModeData} GameModeData
 * @property {boolean} IsOfficeOpen
 * @property {JukeBox} JukeBox
 * @property {number} LastJunkyardSpawnDay
 * @property {Lift} Lift_Garage
 * @property {Lift} Lift_MechanicalWorkshop2
 * @property {PlayerStatistics} PlayerStatistics
 * @property {RepairMachine} RepairMachine
 * @property {RepairMachine} RepairMachine2
 * @property {TrophyShelf} TrophyShelf
 * @property {UndergroundGarageCarStorage} UndergroundGarageCarStorage
 * @property {WorkersData} WorkersData
 */

/**
 * @typedef {Object} WorkersData
 * @property {WorkerData} Worker01
 * @property {WorkerData} Worker02
 * @property {WorkerData} Worker03
 * @property {WorkerData} Worker04
 * @property {WorkersInfo} WorkersInfo
 */

/**
 * @typedef {Object} WorkersInfo
 * @property {string[]} assignedWorkers_Index
 * @property {string} assignedWorkers_Type
 * @property {string[]} hiredWorkers
 */

/**
 * @typedef {Object} WorkerData
 * @property {string[]} RelatedSalaryBills
 * @property {number} Salary
 * @property {WorkerInstance} WorkerInstance
 */

/**
 * @typedef {Object} WorkerInstance
 * @property {boolean} bCanBeDamaged
 * @property {string} currentWorkerStatus
 * @property {boolean} isWashActive
 * @property {boolean} isWaxPolishActive
 * @property {string} issueIndex
 * @property {number} workDuration
 * @property {number} workDurationMax
 * @property {number} workDurationMod
 * @property {string} workerIndex
 * @property {string} zoneIndex
 */

/**
 * @typedef {Object} JukeBox
 * @property {boolean} bCanBeDamaged
 * @property {number} currentIndexPlaying
 * @property {[]} soundQueue
 */

/**
 * @typedef {Object} UndergroundGarageCarStorage
 * @property {number} StorageLimit
 * @property {garageVehicle[]} VehicleInfo
 */

/**
 * @typedef {Object} garageVehicle
 * @property {brakesParts} brakesParts
 * @property {number} buyingCarPartsScore
 * @property {number} buyingMarketPrice
 * @property {number} buyingPlayerPrice
 * @property {boolean} canCreateOffer
 * @property {[]} capturedPoints
 * @property {number} capturedPointsInOffer
 * @property {number} capturedPointsMax
 * @property {string} carId
 * @property {boolean} carplateCleaned
 * @property {string} carplateId
 * @property {clutchParts} clutchParts
 * @property {vehicleColor} color
 * @property {dateObject} createdTimeInWorld
 * @property {number} curPolishValue
 * @property {number} curWashValue
 * @property {number} currentDirtValue
 * @property {number} currentMileage
 * @property {number} currentRustValue
 * @property {number} dirtTextureMaskIndex
 * @property {electricParts} electricParts
 * @property {engineParts} engineParts
 * @property {Object} exhaustHoles
 * @property {exhaustParts} exhaustParts
 * @property {string} fuelType
 * @property {fusesState} fusesState
 * @property {number} garageEntryFuel
 * @property {VehicleData} garageVehicleJsonData
 * @property {string} gearboxType
 * @property {number} initMileage
 * @property {number} initPolishValue
 * @property {number} initWashValue
 * @property {boolean} initWashValuesSet
 * @property {number} initialDirtValue
 * @property {number} initialRustValue
 * @property {boolean} isAbandonedWreck
 * @property {boolean} isWreckForSell
 * @property {miscParts} miscParts
 * @property {string} modelName
 * @property {number} odometerDurability
 * @property {number} odometerMileageLimit
 * @property {number} odometerMileageOrigin
 * @property {boolean} photoMadeByPhotoStudio
 * @property {boolean} playerOwned
 * @property {number} productionYear
 * @property {radiatorParts} radiatorParts
 * @property {number} rustTextureMaskIndex
 * @property {number} sellingPlayerPrice
 * @property {number} startDirtValue
 * @property {number} startRustValue
 * @property {suspentionParts} suspentionParts
 * @property {number} vehicleScoreCache
 * @property {boolean} wasWreck
 */

/**
 * @typedef {Object} brakesParts
 * @property {carPart} frontBrakeClipL
 * @property {carPart} frontBrakeClipR
 * @property {carPart} frontBrakeDiscL
 * @property {carPart} frontBrakeDiscR
 * @property {carPart} rearBrakeClipL
 * @property {carPart} rearBrakeClipR
 * @property {carPart} rearBrakeDiscL
 * @property {carPart} rearBrakeDiscR
 */

/**
 * @typedef {Object} clutchParts
 * @property {carPart} clutchDisk
 */

/**
 * @typedef {Object} electricParts
 * @property {carPart} battery
 */

/**
 * @typedef {Object} engineParts
 * @property {carPart} engine
 */

/**
 * @typedef {Object} exhaustParts
 * @property {carPart} catalytic
 * @property {carPart} mainfold
 * @property {carPart} muffler
 * @property {carPart} resonator
 * @property {carPart} tailPipe
 */

/**
 * @typedef {Object.<number, carFuse>} fusesState
 * @property {carFuse} [1]
 * @property {carFuse} [2]
 * @property {carFuse} [3]
 * @property {carFuse} [4]
 * @property {carFuse} [5]
 * @property {carFuse} [6]
 * @property {carFuse} [7]
 * @property {carFuse} [8]
 * @property {carFuse} [9]
 * @property {carFuse} [10]
 * @property {carFuse} [11]
 * @property {carFuse} [12]
 * @property {carFuse} [13]
 * @property {carFuse} [14]
 * @property {carFuse} [15]
 * @property {carFuse} [16]
 * @property {carFuse} [17]
 * @property {carFuse} [18]
 * @property {carFuse} [19]
 * @property {carFuse} [20]
 * @property {carFuse} [21]
 * @property {carFuse} [22]
 * @property {carFuse} [23]
 * @property {carFuse} [24]
 * @property {carFuse} [25]
 * @property {carFuse} [26]
 * @property {carFuse} [27]
 * @property {carFuse} [28]
 * @property {carFuse} [29]
 * @property {carFuse} [30]
 * @property {carFuse} [31]
 * @property {carFuse} [32]
 * @property {carFuse} [33]
 * @property {carFuse} [34]
 * @property {carFuse} [35]
 * @property {carFuse} [36]
 * @property {carFuse} [37]
 * @property {carFuse} [38]
 * @property {carFuse} [39]
 * @property {carFuse} [40]
 * @property {carFuse} [41]
 * @property {carFuse} [42]
 */

/**
 * @typedef {Object} carFuse
 * @property {number} durability
 * @property {number} initialDurability
 * @property {boolean} installed
 * @property {string} power
 */

/**
 * @typedef {Object} transform
 * @property {rotation} rotation
 * @property {scale3D} scale3D
 * @property {translation} translation
 */

/**
 * @typedef {Object} rotation
 * @property {number} w
 * @property {number} x
 * @property {number} y
 * @property {number} z
 */

/**
 * @typedef {Object} scale3D
 * @property {number} x
 * @property {number} y
 * @property {number} z
 */

/**
 * @typedef {Object} translation
 * @property {number} x
 * @property {number} y
 * @property {number} z
 */

/**
 * @typedef {Object} levelPlacedVehicleSettings
 * @property {string} carId
 */

/**
 * @typedef {Object} miscParts
 * @property {carPart} frontWheelR
 * @property {carPart} rightWheelScrew5
 * @property {carPart} rightWheelScrew4
 * @property {carPart} rightWheelScrew3
 * @property {carPart} rightWheelScrew2
 * @property {carPart} rightWheelScrew1
 * @property {carPart} rightSuspentionPinScrew1
 * @property {carPart} rightSuspentionPinScrew2
 * @property {carPart} rightSuspentionPinScrew3
 * @property {carPart} rightSuspentionPinScrew4
 * @property {carPart} leftWheelScrew1
 * @property {carPart} leftWheelScrew2
 * @property {carPart} leftWheelScrew3
 * @property {carPart} leftWheelScrew4
 * @property {carPart} leftWheelScrew5
 * @property {carPart} frontWheelL
 * @property {carPart} frontScrewAbsorberR01
 * @property {carPart} frontScrewAbsorberR02
 * @property {carPart} frontScrewAbsorberR03
 * @property {carPart} frontScrewAbsorberR04
 * @property {carPart} frontScrewAbsorberR05
 * @property {carPart} frontScrewAbsorberR06
 * @property {carPart} frontScrewAbsorberL01
 * @property {carPart} frontScrewAbsorberL02
 * @property {carPart} frontScrewAbsorberL03
 * @property {carPart} frontScrewAbsorberL04
 * @property {carPart} frontScrewAbsorberL05
 * @property {carPart} frontScrewAbsorberL06
 * @property {carPart} leftSuspentionPinScrew1
 * @property {carPart} leftSuspentionPinScrew2
 * @property {carPart} leftSuspentionPinScrew3
 * @property {carPart} rearWheelR
 * @property {carPart} rightWheelScrew1R
 * @property {carPart} rightWheelScrew2R
 * @property {carPart} rightWheelScrew3R
 * @property {carPart} rightWheelScrew4R
 * @property {carPart} rightWheelScrew5R
 * @property {carPart} rearScrewAbsorberR01
 * @property {carPart} rearScrewAbsorberR02
 * @property {carPart} rearScrewAbsorberR03
 * @property {carPart} rearScrewAbsorberR04
 * @property {carPart} leftWheelScrew1R
 * @property {carPart} leftWheelScrew2R
 * @property {carPart} leftWheelScrew3R
 * @property {carPart} leftWheelScrew4R
 * @property {carPart} leftWheelScrew5R
 * @property {carPart} rearWheelL
 * @property {carPart} rearScrewAbsorberL04
 * @property {carPart} rearScrewAbsorberL03
 * @property {carPart} rearScrewAbsorberL02
 * @property {carPart} rearScrewAbsorberL01
 * @property {carPart} mainfoldScrew1
 * @property {carPart} mainfoldScrew2
 * @property {carPart} mainfoldScrew3
 * @property {carPart} mainfoldScrew4
 * @property {carPart} mainfoldScrew5
 * @property {carPart} mainfoldScrew6
 * @property {carPart} mainfoldScrew7
 * @property {carPart} mainfoldScrew8
 * @property {carPart} mainfoldScrew9
 * @property {carPart} mainfoldScrew10
 * @property {carPart} clutchScrew1
 * @property {carPart} clutchScrew2
 * @property {carPart} clutchScrew3
 * @property {carPart} clutchScrew4
 * @property {carPart} clutchScrew5
 * @property {carPart} clutchScrew6
 * @property {carPart} pressurePlate
 * @property {carPart} radiatorScrew5
 * @property {carPart} radiatorScrew4
 * @property {carPart} radiatorScrew3
 * @property {carPart} radiatorScrew2
 * @property {carPart} radiatorScrew1
 * @property {carPart} batteryClamp2
 * @property {carPart} batteryClamp1
 * @property {carPart} batteryScrew2
 * @property {carPart} batteryScrew1
 */

/**
 * @typedef {Object} radiatorParts
 * @property {carPart} radiator
 */

/**
 * @typedef {Object} suspentionParts
 * @property {carPart} frontShockAbsorberL
 * @property {carPart} frontShockAbsorberR
 * @property {carPart} leftSuspentionPin
 * @property {carPart} rightSuspentionPin
 * @property {carPart} rearShockAbsorberL
 * @property {carPart} rearShockAbsorberR
 */

/**
 * @typedef {Object} carPart
 * @property {number} durability
 * @property {number} initialDurability
 * @property {boolean} installed
 */

/**
 * @typedef {Object} vehicleColor
 * @property {string} colorName
 * @property {color} color
 */

/**
 * @typedef {Object} TrophyShelf
 * @property {ItemContainer} ItemContainer
 * @property {boolean} bCanBeDamaged
 * @property {_TrophyShelf} TrophyShelf
 */

/**
 * @typedef {Object} ItemContainer
 * @property {Items} Items
 */

/**
 * @typedef {Object} Items
 * @property {item[]} itemsJsons
 */

/**
 * @typedef {Object} item
 * @property {productID} productID
 * @property {itemData} json

/**
 * @typedef {Object} itemData
 * @property {string} customData
 * @property {number} durability
 * @property {boolean} transferLocked
 * @property {boolean} [isExhibited]
 */

/**
 * @typedef {'VehicleTrophy' | 'CandyOne' | 'Cigarette' | 'CarplateRepairKit' |
 *  'BrakeClips' | 'BrakeDisc' | 'Engine' | 'ExhaustCatalyticConverter' |
 *  'ExhaustMainfold' | 'ExhaustMuffler' | 'ExhaustResonator' | 'ExhaustTailPipe' | 'SealingTape' |
 *  'FrontShockAbsorber' | 'RearShockAbsorber' | 'SuspensionArmPin' | 'battery' | 'clutch' | 'intercooler' |
 *  'Fuse5' | 'Fuse10' | 'Fuse15' | 'Fuse20' | 'Fuse25' | 'Fuse30' | 'Fuse40' | 'Fuse50' | 'Fuse60'} productID
 */

/**
 * @typedef {Object} _TrophyShelf
 * @property {TrophyShelfSlots} TrophyShelfSlots
 * @property {boolean} bCanBeDamaged
 */

/**
 * @typedef {Object} TrophyShelfSlots
 * @property {TrophySlot[]} itemsJsons
 */

/**
 * @typedef {Object} TrophySlot
 * @property {string} trophyShelfSlot
 * @property {number} trophyInContainerIndex
 */

/**
 * @typedef {Object} PlayerStatistics
 * @property {Object.<string, statisticValue>} statisticValues
 */

/**
 * @typedef {Object} statisticValue
 * @property {boolean} boolean
 * @property {number} float
 * @property {number} integer
 * @property {string} string
 * @property {string} valueType
 */

/**
 * @typedef {Object} Lift
 * @property {string} zoneIndex
 * @property {boolean} bCanBeDamaged
 * @property {boolean} isLiftUp
 */

/**
 * @typedef {Object} RepairMachine
 * @property {Object} ItemContainer
 * @property {boolean} bCanBeDamaged
 * @property {number} carPartsRepairMachineTargetDuration
 * @property {string} iD
 * @property {boolean} isCoverClose
 *
 */

/**
 * @typedef {Object} BillsAndLoans
 * @property {[]} LoanData
 * @property {Object} billTransactionData
 * @property {number} bill_Energy
 * @property {number} bill_Property
 * @property {number} bill_Water
 * @property {boolean} isSamPaidOff
 * @property {number} loanHistory
 * @property {number} usage_Energy
 * @property {number} usage_Water
 *
 */

/**
 * @typedef {Object} BrandData
 * @property {number} bervelSize
 * @property {number} bervelTypeIndex
 * @property {number} bevelSegments
 * @property {string} brandName
 * @property {number} characterSpacing
 * @property {color} colorBackground
 * @property {color} colorBervel
 * @property {color} colorExtrude
 * @property {color} colorFont
 * @property {number} extrude
 * @property {number} fontIndex
 * @property {number} fontSize
 * @property {boolean} isValid
 * @property {number} worldSpacing
 */

/**
 * @typedef {Object} color
 * @property {number} r
 * @property {number} g
 * @property {number} b
 * @property {number} a
 */

/**
 * @typedef {Object} GameModeData
 * @property {boolean} bCanBeDamaged
 * @property {[]} boughtUpgrades
 * @property {BrandData} currentSignboardData
 * @property {defaultVehicleConditionSettings} defaultVehicleConditionSettings
 * @property {boolean} isActiveUpdateVehicleConditionSettings
 * @property {number} lastJunkyardSpawnDay
 * @property {[]} levelPlacedDeletedVehicles
 * @property {number} resetCarCooldown
 * @property {Object} specialNPCFirstMailsSent
 * @property {Object} specialNPCLastOrderStatus
 */

/**
 * @typedef {Object} defaultVehicleConditionSettings
 * @property {boolean} allowBrokenFuses
 * @property {boolean} allowExhaustHoles
 * @property {number} allowNotInstalledCarParts
 * @property {Object} customAllowNotInstalledCarParts
 * @property {Object} customDamageCarParts
 * @property {damageCarParts} damageCarParts
 */

/**
 * @typedef {Object} damageCarParts
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef {Object} TrophySlot
 * @property {'Apex Motors Striker' | 'Apex Motors Vanguard' | 'Ardena Ignis' | 'Cargo Wise P2' | 'Cargo Wise P3' |
 * 'Cargo Wise P4' | 'Cavallaro 280G' | 'Harmonia Vehicles Allegretto' | 'Harmonia Vehicles Andante' | 'Harmonia Vehicles Largo' |
 * 'NGD Pulse' | 'Off Rider Boulder' | 'Off Rider Canyon' | 'Off Rider Ridge' | 'Phantom Cortega' | 'Phantom Gale' | 'Phantom Thunder' |
 * 'Phantom ThunderX' | 'Phantom Voyager' | 'UMX 600C' | 'Zen Motors Journey'} name - The name of the trophy slot.
 * @property {number} year - The production year.
 * @property {'Apex Motors' | 'Ardena' | 'Cargo Wise' | 'Cavallaro' | 'Harmonia Vehicles' |
 * 'NGD' | 'Off Rider' | 'Phantom' | 'UMX' | 'Zen Motors'} brand - The brand of the car.
 * @property {'Striker' | 'Vanguard' | 'Ignis' | 'P2' | 'P3' | 'P4' | '280G' | 'Allegretto' | 'Andante' | 'Largo' | 'Pulse' |
 * 'Boulder' | 'Canyon' | 'Ridge' | 'Cortega' | 'Gale' | 'Thunder' | 'ThunderX' | 'Voyager' | '600C' | 'Journey'} model - The model of the car.
 * @property {'common' | 'rust' | 'silver' | 'gold' | 'diamond'} type - Trophy type
 */

export {};
